# package import ----------------------------------------------------------
library(tidyverse)
library(jsonlite)
library(glue)

# custom functions --------------------------------------------------------

# database import ---------------------------------------------------------
database <-
  fireData::download("https://XXX.firebaseio.com", "/") %>% 
  write_rds(glue("backup/{as.integer(Sys.time())}.RData")) 

# participant dataset -----------------------------------------------------
dataset_participant <-
  database %>% 
  pluck("participant_id") %>% 
  map_dfr(~data_frame(epoch = .x$timestamp,
                      session_id = .x$session_id,
                      prolific_id = .x$prolific_id,
                      cond_approach_training = .x$vaast_approach_training,
                      cond_iat_self_side = .x$iat_self_side,
                      cond_iat_luupite_1_side = .x$iat_luupite_1_side)) %>% 
  mutate(timestamp = lubridate::as_datetime(epoch / 1000 )) 

# vaast dataset -----------------------------------------------------------
dataset_vaast_trial <-
  database %>% 
  pluck("vaast_trial") %>% 
  map_dfr(~data_frame(epoch = .x$timestamp,
                       session_id = .x$session_id,
                       temp_data = .x$vaast_trial_data)) %>% 
    mutate(timestamp = lubridate::as_datetime(epoch / 1000 ),
           temp_data = map(temp_data, ~ fromJSON(.x))) %>% 
    unnest()

# iat dataset -------------------------------------------------------------
dataset_iat_trial <-
  database %>% 
  pluck("iat_trial") %>% 
  map_dfr(~data_frame(epoch = .x$timestamp,
                      session_id = .x$session_id,
                      temp_data = .x$iat_trial_data)) %>% 
  mutate(timestamp = lubridate::as_datetime(epoch / 1000 ),
         temp_data = map(temp_data, ~ fromJSON(.x))) %>% 
  unnest()

# browser event dataset ---------------------------------------------------
dataset_browser_event <-
  database %>% 
  pluck("browser_event") %>% 
  map_dfr(~data_frame(epoch = .x$timestamp,
                      session_id = .x$session_id,
                      temp_data = .x$event_data,
                      completion = .x$completion),
          .id = "id") %>%
  group_by(session_id) %>%
  arrange(desc(epoch)) %>% 
  filter(row_number() == 1) %>% 
  ungroup() %>% 
  mutate(timestamp = lubridate::as_datetime(epoch / 1000),
         temp_data = map(temp_data, ~ fromJSON(.x))) %>% 
  unnest()



dataset_extra <-
  database %>% 
  pluck("extra_info") %>%
  map_dfr(~data_frame(epoch = .x$timestamp,
                      session_id = .x$session_id,
                      temp_data = .x$extra_data),
          .id = "id") %>% 
  mutate(timestamp = lubridate::as_datetime(epoch / 1000),
         temp_data = map(temp_data, ~ fromJSON(.x))) %>% 
  unnest() %>%
  mutate(temp_data = map(responses, ~ fromJSON(.x))) %>% 
  group_by(session_id) %>% 
  mutate(good_condition = temp_data[internal_node_id == "0.0-34.0"],
         tasks          = temp_data[internal_node_id == "0.0-35.0"]) %>% 
  select(session_id, good_condition, tasks) %>% 
  rowwise() %>% 
  mutate(good_condition = pluck(good_condition, 1),
         task_vaast     = pluck(tasks, 1),
         task_iat       = pluck(tasks, 2)) %>% 
  ungroup() %>% 
  select(-tasks) %>% 
    distinct() 

# connections -------------------------------------------------------------

dataset_connection <-
  database %>% 
  pluck("connection") %>%
  map_dfr(~data_frame(data = list(pluck(.x))),
          .id = "session_id") %>% 
  unnest() %>% 
  mutate(data = map(data, ~data_frame(epoch  = .x$timestamp,
                                      status = .x$status) %>% 
                      mutate(timestamp = lubridate::as_datetime(epoch / 1000))
                             )) %>% 
  unnest()

# export ------------------------------------------------------------------
map2(list(dataset_browser_event,
          dataset_iat_trial,
          dataset_participant,
          dataset_vaast_trial,
          dataset_connection,
          dataset_extra),
     list("dataset_browser_event",
          "dataset_iat_trial",
          "dataset_participant",
          "dataset_vaast_trial",
          "dataset_connection",
          "dataset_extra"),
     ~write_rds(.x, glue("data/{.y}.RData")))


