/// LICENCE -----------------------------------------------------------------------------
//
// Copyright 2018 - Cédric Batailler
//
// Permission is hereby granted, free of charge, to any person obtaining a copy of this
// software and associated documentation files (the "Software"), to deal in the Software
// without restriction, including without limitation the rights to use, copy, modify,
// merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so, subject to the following
// conditions:
//
// The above copyright notice and this permission notice shall be included in all copies
// or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
// INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
// PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
// HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
// CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE
// OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//
// OVERVIEW -----------------------------------------------------------------------------
//
// TODO:
// 
// dirty hack to lock scrolling ---------------------------------------------------------
// note that jquery needs to be loaded.
$('body').css({'overflow':'hidden'});
  $(document).bind('scroll',function () { 
       window.scrollTo(0,0); 
  });

// safari & ie exclusion ----------------------------------------------------------------
var is_safari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
var is_ie = /*@cc_on!@*/false || !!document.documentMode;

var is_compatible = !(is_safari || is_ie);


if(!is_compatible) {

    var safari_exclusion = {
        type: "html-keyboard-response",
        stimulus:
        "<p>Sorry, this study is not compatible with your browser.</p>" +
        "<p>Please try again with a compatible browser (e.g., Chrome or Firefox).</p>",
        choices: jsPsych.NO_KEYS
    };

    var timeline_safari = [];

    timeline_safari.push(safari_exclusion);
    jsPsych.init({timeline: timeline_safari});

}

// firebase initialization ---------------------------------------------------------------
  var firebase_config = {
    apiKey: "AIzaSyBwDr8n-RNCbBOk1lKIxw7AFgslXGcnQzM",
    databaseURL: "https://marineexpe.firebaseio.com/"
  };

  firebase.initializeApp(firebase_config);
  var database = firebase.database();

  // prolific variables
  var prolificID = jsPsych.data.getURLVariable("prolificID");
  if(prolificID == null) {prolificID = "999";}
  var jspsych_id  = jsPsych.data.getURLVariable("jspsych_id");
   if(jspsych_id == null) {jspsych_id = "999";}

  //var session_id  = jsPsych.randomization.randomID();

  // connection status ---------------------------------------------------------------------
  // This section ensure that we don't lose data. Anytime the 
  // client is disconnected, an alert appears onscreen
  var connectedRef = firebase.database().ref(".info/connected");
  var connection   = firebase.database().ref("VAAST_3appuis/" + jspsych_id + "/")
  var dialog = undefined;
  var first_connection = true;

  connectedRef.on("value", function(snap) {
    if (snap.val() === true) {
      connection
        .push()
        .set({status: "connection",
              timestamp: firebase.database.ServerValue.TIMESTAMP})

      connection
        .push()
        .onDisconnect()
        .set({status: "disconnection",
              timestamp: firebase.database.ServerValue.TIMESTAMP})

    if(!first_connection) {
      dialog.modal('hide');
    }
    first_connection = false;
    } else {
      if(!first_connection) {
      dialog = bootbox.dialog({
          title: 'Connection lost',
          message: '<p><i class="fa fa-spin fa-spinner"></i> Please wait while we try to reconnect.</p>',
          closeButton: false
          });
    }
    }
  });

    // counter variables
  var vaast_trial_n    = 1;
  var browser_events_n = 1;

// Variable input -----------------------------------------------------------------------
// Variable used to define experimental condition.

var vaast_condition_approach_1 = jsPsych.randomization.sampleWithoutReplacement(["approach_blue", "approach_yellow"], 1)[0];

 // cursor helper functions
var hide_cursor = function() {
	document.querySelector('head').insertAdjacentHTML('beforeend', '<style id="cursor-toggle"> html { cursor: none; } </style>');
}
var show_cursor = function() {
	document.querySelector('#cursor-toggle').remove();
}

var hiding_cursor = {
    type: 'call-function',
    func: hide_cursor
}

var showing_cursor = {
    type: 'call-function',
    func: show_cursor
}

// VAAST --------------------------------------------------------------------------------
// VAAST variables ----------------------------------------------------------------------
// On duplique chacune des variable pour correspondre au bloc 1 et au bloc 2 !

var movement_blue_1    = undefined;
var movement_yellow_1    = undefined;
var group_to_approach_1 = undefined;
var group_to_avoid_1    = undefined;
var movement_blue_2    = undefined;
var movement_yellow_2    = undefined;
var group_to_approach_2 = undefined;
var group_to_avoid_2    = undefined;

switch(vaast_condition_approach_1) {
  case "approach_blue":
    movement_blue_1    = "approach";
    movement_yellow_1    = "avoidance";
    group_to_approach_1 = "blue-background";
    group_to_avoid_1    = "yellow-background";
    movement_blue_2    = "avoidance";
    movement_yellow_2    = "approach";
    group_to_approach_2 = "yellow-background";
    group_to_avoid_2    = "blue-background";
    break;

  case "approach_yellow":
    movement_blue_1    = "avoidance";
    movement_yellow_1    = "approach";
    group_to_approach_1 = "yellow-background";
    group_to_avoid_1    = "blue-background";
    movement_blue_2    = "approach";
    movement_yellow_2    = "avoidance";
    group_to_approach_2 = "blue-background";
    group_to_avoid_2    = "yellow-background";
    break;
}

// VAAST stimuli ------------------------------------------------------------------------
// vaast image stimuli ------------------------------------------------------------------
// Ici, on ajoute un nouveau mouvement, en fonction du bloc de la vaast on appellera soit
// movement_1 ou movement_2.

var vaast_stim_training = [
  {movement_1: movement_blue_1, movement_2: movement_blue_2, group: "blue-background", stimulus: 'stimuli/Face19_B.png'},
  {movement_1: movement_blue_1, movement_2: movement_blue_2, group: "blue-background", stimulus: 'stimuli/Face28_B.png'},
  {movement_1: movement_blue_1, movement_2: movement_blue_2, group: "blue-background", stimulus: 'stimuli/Face55_B.png'},
  {movement_1: movement_blue_1, movement_2: movement_blue_2, group: "blue-background", stimulus: 'stimuli/Face95_B.png'},
  {movement_1: movement_blue_1, movement_2: movement_blue_2, group: "blue-background", stimulus: 'stimuli/Face104_B.png'},
  {movement_1: movement_blue_1, movement_2: movement_blue_2, group: "blue-background", stimulus: 'stimuli/Face115_B.png'},
  {movement_1: movement_blue_1, movement_2: movement_blue_2, group: "blue-background", stimulus: 'stimuli/Face119_B.png'},
  {movement_1: movement_blue_1, movement_2: movement_blue_2, group: "blue-background", stimulus: 'stimuli/Face142_B.png'},
  {movement_1: movement_yellow_1, movement_2: movement_yellow_2,  group: "yellow-background",  stimulus: 'stimuli/Face10_J.png'},
  {movement_1: movement_yellow_1, movement_2: movement_yellow_2,  group: "yellow-background",  stimulus: 'stimuli/Face16_J.png'},
  {movement_1: movement_yellow_1, movement_2: movement_yellow_2,  group: "yellow-background",  stimulus: 'stimuli/Face17_J.png'},
  {movement_1: movement_yellow_1, movement_2: movement_yellow_2,  group: "yellow-background",  stimulus: 'stimuli/Face45_J.png'},
  {movement_1: movement_yellow_1, movement_2: movement_yellow_2,  group: "yellow-background",  stimulus: 'stimuli/Face85_J.png'},
  {movement_1: movement_yellow_1, movement_2: movement_yellow_2,  group: "yellow-background",  stimulus: 'stimuli/Face103_J.png'},
  {movement_1: movement_yellow_1, movement_2: movement_yellow_2,  group: "yellow-background",  stimulus: 'stimuli/Face116_J.png'},
  {movement_1: movement_yellow_1, movement_2: movement_yellow_2,  group: "yellow-background",  stimulus: 'stimuli/Face132_J.png'}
]


// vaast background images --------------------------------------------------------------,

var background = [
    "background/1.jpg",
    "background/2.jpg",
    "background/3.jpg",
    "background/4.jpg",
    "background/5.jpg",
    "background/6.jpg",
    "background/7.jpg"
];


// vaast stimuli sizes -------------------------------------------------------------------

 var stim_sizes = [
    34,
    38,
    42,
    46,
    52,
    60,
    70
  ];

  var resize_factor = 7;
  var image_sizes = stim_sizes.map(function(x) { return x * resize_factor; });

// Helper functions ---------------------------------------------------------------------
  // next_position():
  // Compute next position as function of current position and correct movement. Because
  // participant have to press the correct response key, it always shows the correct
  // position.
var next_position_training = function(){
  var current_position = jsPsych.data.getLastTrialData().values()[0].position;
  var current_movement = jsPsych.data.getLastTrialData().values()[0].movement;
  var position = current_position;

  if(current_movement == "approach") {
    position = position + 1;
  }

  if(current_movement == "avoidance") {
    position = position -1;
  }

  return(position)
}

var next_position = function(){
  var current_position = jsPsych.data.getLastTrialData().values()[0].position;
  var last_keypress = jsPsych.data.getLastTrialData().values()[0].key_press;

  var approach_key = jsPsych.pluginAPI.convertKeyCharacterToKeyCode('y');
  var avoidance_key = jsPsych.pluginAPI.convertKeyCharacterToKeyCode('n');

  var position = current_position;

  if(last_keypress == approach_key) {
    position = position + 1;
  }

  if(last_keypress == avoidance_key) {
    position = position -1;
  }

  return(position)
}

// Saving blocks ------------------------------------------------------------------------
// Every function here send the data to keen.io. Because data sent is different according
// to trial type, there are differents function definition.

// init ---------------------------------------------------------------------------------
  var saving_id = function(){
     database
        .ref("participant_id/")
        .push()
        .set({jspsych_id: jspsych_id,
               prolificID: prolificID,
               experimental_condition: vaast_condition_approach_1,
               timestamp: firebase.database.ServerValue.TIMESTAMP})
  }

// vaast trial --------------------------------------------------------------------------
  var saving_vaast_trial = function(){
    database
      .ref("vaast_trial/").
      push()
        .set({jspsych_id: jspsych_id,
          prolificID: prolificID,
          experimental_condition: vaast_condition_approach_1,
          timestamp: firebase.database.ServerValue.TIMESTAMP,
          vaast_trial_data: jsPsych.data.get().last(3).json()})
  }


// demographic logging ------------------------------------------------------------------

  var saving_browser_events = function(completion) {
    database
     .ref("browser_event/")
     .push()
     .set({jspsych_id: jspsych_id,
      prolificID: prolificID,
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      experimental_condition: vaast_condition_approach_1,
      completion: completion,
      event_data: jsPsych.data.getInteractionData().json()})
  }


// saving blocks ------------------------------------------------------------------------
var save_id = {
    type: 'call-function',
    func: saving_id
}

var save_vaast_trial = {
    type: 'call-function',
    func: saving_vaast_trial
}


// EXPERIMENT ---------------------------------------------------------------------------

// initial instructions -----------------------------------------------------------------
  var welcome = {
    type: "html-keyboard-response",
    stimulus:
      "<h1 class ='custom-title'> Welcome </h1>" +
      "<p class='instructions'>Thank you for participating in this study.<p>" +
      "<p class='instructions'>During this study, you will have to complete two different tasks. Note that we " +
      " will not collect any personally identifying information.</p>" +
      "<p class='instructions'>Because we rely on third party services to gather data, ad-blocking " +
      "software might interfere with data collection. Therefore, please  " +
      "disable your ad-blocking software during this study. " +
      "<b>If we are unable to record your data, we will not be able to reward you for " +
      "your participation</b>. </p>" +
      "<p class='instructions'>If you have any question related to this research, please " +
      "e-mail marine.rougier@uclouvain.be.</p>" +
      "<p class = 'continue-instructions'>Press <strong>space</strong> to start the study.</p>",
    choices: [32]
  };

  var consent = {
    type: "html-button-response",
    stimulus:
      "<p class='instructions'>By clicking below to start the study, you recognize that:</p>" +
        "<ul class='instructions'>" +
          "<li>You know that you can stop your participation at any time, without having to justify yourself. " +
          "However, keep in mind that you need to complete the whole study in order to be paid.</li>" +
          "<li>You know that you can contact our team for any questions or dissatisfaction related to your " +
          "participation in the research via the following email address: marine.rougier@uclouvain.be.</li>" +
          "<li>You know that the data collected will be strictly confidential and it will be impossible for " +
          "any unauthorized third party to identify you.</li>" +
        "</ul>" +
      "<p class='instructions'>By clicking on the \"I confirm\" button, you give your free and informed consent to participate " +
      "in this research.</p>",
    choices: ['I confirm']
  }

  var welcome_2 = {
    type: "html-button-response",
    stimulus:
      "<p class='instructions'>Before going further, please note that this study should take " +
      "## minutes to complete.</p>",
    choices: ['I have enough time', 'I do not have enough time'],
  };

  var not_enough_time_to_complete = {
      type: 'html-button-response',
      stimulus: '<p>Please come back later to take part in this experiment.</p>',
      choices: ['Go back to Prolific Academic'],
  };

  var redirect_to_prolific = {
      type: 'call-function',
      func: function() {
          window.location.href = "https://www.prolific.ac/";
          jsPsych.pauseExperiment();
      }
  }

  var if_not_enough_time = {
      timeline: [not_enough_time_to_complete, redirect_to_prolific],
      conditional_function: function(){
          // get the data from the previous trial,
          // and check which key was pressed
          var data = jsPsych.data.getLastTrialData().values()[0].button_pressed;
          if(data == 1){
              return true;
          } else {
              return false;
          }
      }
  }


// Switching to fullscreen --------------------------------------------------------------
var fullscreen_trial = {
  type: 'fullscreen',
  message:  'To start Task 2, please switch again to full screen </br></br>',
  button_label: 'Switch to fullscreen',
  fullscreen_mode: true
}


// VAAST --------------------------------------------------------------------------------
var Gene_Instr = {
  type: "html-keyboard-response",
  stimulus:
    "<h1 class ='custom-title'> Experiment on face categorization</h1>" +
    "<p class='instructions'>We are interested in the way people categorize " +
    "other people and, more specifically, their face." +
    "<br>" +
   "<p class='instructions'> In this experiment, you will have to" +
    " perform two categorization tasks.</p>" +
    "<p class='instructions'>1) The 'Video Game' task (approx. 15 min)" +
    " 2) The recognition task (approx. 15 min)</p>" +
    "<br>" +
    "<p class = 'continue-instructions'>Press <strong>space</strong> to" +
    " continue.</p>",
  choices: [32]
};


var vaast_instructions_1 = {
  type: "html-keyboard-response",
  stimulus:
    "<h1 class ='custom-title'> Video Game task</h1>" +
    "<p class='instructions'>In this task, just like in a video game, you " +
    "will act within the environment presented below." +
   "<p class='instructions'> You will be able to move forward and backward" +
    " using keys on your keyboard.</p>" +
    "<p class='instructions'>First names will appear within the" +
    " environment and you will have to approach them or avoid them" +
    " according to the category they belong to.</p>" +
    "<br>" +
    "<img src = 'media/vaast-background.png'>" +
    "<br>" +
    "<p class = 'continue-instructions'>Press <strong>space</strong> to" +
    " continue.</p>",
  choices: [32]
};

var vaast_instructions_2 = {
  type: "html-keyboard-response",
  stimulus:
    "<h1 class ='custom-title'> Video Game task </h1>" +
    "<p class='instructions'> A series of first names will be displayed in this environment. " +
    "As you will see, some of these first names are usually associated " +
    "with African Americans (typical African Americans first names) vs. European Americans (typical European Americans first names)." +
    "<p class='instructions'>Your task is to move forward or backward as a function of these first names " +
    "(more specific instructions following) and this by using the following keys on your keyboard: </p>" +
    "<p class='instructions'>Y = to MOVE FORWARD </p>" +
    "<p class='instructions'>H = START key </p>" +
    "<p class='instructions'>N = to MOVE BACKWARD </p>" +
    "<br>" +
    "<p class = 'continue-instructions'>Press <strong>space</strong> to" +
    " continue.</p>",
  choices: [32]
};

var vaast_instructions_2_1 = {
  type: "html-keyboard-response",
  stimulus:
    "<h1 class ='custom-title'> Video Game task </h1>" +
    "<p class='instructions'><center>Here are the two categories and the items belonging to each category</center></p>" +
    "<table>" +
      "<tr>" +
        "<th width='200px'>Category</th>" +
        "<th align='left'>Item</th>" +
      "</tr>" +
      "<tr>" +
        "<td>European Americans</td>" +
        "<td align='left'>Adam, Chip, Harry, Josh, Roger, Alan, Franck, Ian, Justin, Ryan, Andrew, Fred, Jack, Matthew, Stephen, Brad, Greg, Jed, Paul, Todd, Brandon, Hank, Jonathan, Peter, Wilbur</td>" +
      "</tr>" +
      "<tr>" +
        "<td>African Americans</td>" +
        "<td align='left'>Alonzo, Jamel, Lerone, Percell, Theo, Alphonse, Jerome, Leroy, Rasaan, Torrance, Darnell, Lamar, Lionel, Rashaun, Tyree, Deion, Lamont, Malik, Terrence, Tyrone, Everol, Lavon, Marcellus, Terryl, Wardell</td>" +
      "</tr>" +
    "</table>" +
    "<br>" +
    "<br>" +
    "<p class = 'continue-instructions'>Press <span class='key'>space</span>" +
    " to continue.</p>",
  choices: [32]
};

var vaast_instructions_3 = {
  type: "html-keyboard-response",
  stimulus:
    "<h1 class ='custom-title'> Video Game task </h1>" +
    "<p class='instructions'>At the beginning of each trial, you will see the “O” symbol. " +
    "This symbol indicates that you have to press the START key (namely the H key) to start the trial. </p>" +
    "<p class='instructions'>Then, you will see a fixation cross (+) in the center of the screen followed by a first name.</p>" +
    "<p class='instructions'>Your task is to move forward or backward by pressing the MOVE FORWARD (the Y key) " +
    "or MOVE BACKWARD (the N key) keys as fast as possible." +
    "<p class='instructions'>Please use only the index of your dominant hand for all these actions.</p>" +
    "<br>" +
    "<p class = 'continue-instructions'>Press <strong>space</strong> to" +
    " continue.</p>",
  choices: [32]
};

var vaast_instructions_4 = {
  type: "html-keyboard-response",
  stimulus:
    "<h1 class ='custom-title'> Video Game task - Section 1</h1>" +
    "<p class='instructions'>In this section, you have to: " +
    "<ul class='instructions'>" +
    "<li><strong>Approach (move forward) typical " + group_to_approach_1 + " first names </strong></li>" +
    "<strong>by pressing the Y key </strong>" +
    "<li><strong>Avoid (move backward) typical " + group_to_avoid_1 + " first names </strong></li>" +
    "<strong>by pressing the N key</strong>" +
    "</ul>" +
    "<p class='instructions'>It is very important to remember which action you will " +
    "have to perform for each category. You need this information to complete the " +
    "task successfully.</p>" +
    "<strong> Also, it is EXTREMELY IMPORTANT that you try to respond as fast and as correctly as possible. </strong>." +
    "<p class ='instructions'>You will start with a training phase.</p>" +
    "<p class ='instructions'><u>WARNING</u>: we will report your errors ONLY in the training phase,  " +
    "so read and memorize the instructions above. " + 
    "If your response is false, you will have to start again the trial and make the correct action. " +
    "<br>" +
    "<p class = 'continue-instructions'>Press <strong>enter</strong> to " +
    "begin the training.</p>",
  choices: [13]
};


var vaast_instructions_5 = {
  type: "html-keyboard-response",
  stimulus:
    "<h1 class ='custom-title'> Video Game task - Section 1 </h1>" +
    "<p class='instructions'>The training is now completed. </p>" +
    "<p class='instructions'><u>WARNING</u>: You will no longer have messages to report your errors.</p>" +
    "<p class='instructions'>As a reminder, in this section you have to:</p>" +
    "<ul class='instructions'>" +
     "<li>" +
      "<strong>Approach (move forward) typical " + group_to_approach_1 + " first names </strong>" +
      "<strong>by pressing the Y key</strong>" +
     "</li>" +
     "<li>" +
      "<strong>Avoid (move backward) typical " + group_to_avoid_1 + " first names </strong>" +
      "<strong>by pressing the N key</strong>" +
     "</li>" +
    "</ul>" +
    "<br>" +
    "<p class = 'continue-instructions'>Press <strong>space</strong> to" +
    " continue.</p>",
  choices: [32]
};

var vaast_instructions_6 = {
  type: "html-keyboard-response",
  stimulus:
    "<h1 class ='custom-title'> Video Game task - Section 2</h1>" +
    "<p class='instructions'>In this section, you have to: " +
    "<ul class='instructions'>" +
    "<li><strong>Approach (move forward) typical " + group_to_approach_2 + " first names </strong></li>" +
    "<strong>by pressing the Y key </strong>" +
    "<li><strong>Avoid (move backward) typical " + group_to_avoid_2 + " first names </strong></li>" +
    "<strong>by pressing the N key</strong>" +
    "</ul>" +
    "<p class='instructions'>It is very important to remember which action you will " +
    "have to perform for each category. You need this information to complete the " +
    "task successfully.</p>" +
    "<strong> Also, it is EXTREMELY IMPORTANT that you try to respond as fast and as correctly as possible. </strong>." +
    "<p class ='instructions'>You will start with a training phase.</p>" +
    "<p class ='instructions'><u>WARNING</u>: we will report your errors ONLY in the training phase,  " +
    "so read and memorize the instructions above. " + 
    "If your response is false, you will have to start again the trial and make the correct action. " +
    "<br>" +
    "<br>" +
    "<p class = 'continue-instructions'>Press <strong>enter</strong> to " +
    "begin the training.</p>",
  choices: [13]
};


var vaast_instructions_7 = {
  type: "html-keyboard-response",
  stimulus:
    "<h1 class ='custom-title'> Video Game task - Section 2 </h1>" +
    "<p class='instructions'>The training is now completed. </p>" +
    "<p class='instructions'><u>WARNING</u>: You will no longer have messages to report your errors.</p>" +
    "<p class='instructions'>As a reminder, in this section you have to:</p>" +
    "<ul class='instructions'>" +
     "<li>" +
      "<strong>Approach (move forward) typical " + group_to_approach_2 + " first names </strong>" +
      "<strong>by pressing the Y key</strong>" +
     "</li>" +
     "<li>" +
      "<strong>Avoid (move backward) typical " + group_to_avoid_2 + " first names </strong>" +
      "<strong>by pressing the N key</strong>" +
     "</li>" +
    "</ul>" +
    "<br>" +
    "<p class = 'continue-instructions'>Press <strong>space</strong> to" +
    " continue.</p>",
  choices: [32]
};

// Creating a trial ---------------------------------------------------------------------
// Note: vaast_start trial is a dirty hack which uses a regular vaast trial. The correct
// movement is approach and the key corresponding to approach is "h", thus making the
// participant press "h" to start the trial. 

// Ici encore tout est dupliqué pour correspondre aux deux blocs de la vaast, les trials
// et les procédures, training compris.

var vaast_start = {
  type: 'vaast-text',
  stimulus: "o",
  position: 3,
  background_images: background,
  font_sizes:  stim_sizes,
  approach_key: "h",
  stim_movement: "approach",
  html_when_wrong: '<span style="color: red; font-size: 80px">&times;</span>',
  force_correct_key_press: true,
  display_feedback: true,
  response_ends_trial: true
}

var vaast_fixation = {
  type: 'vaast-fixation',
  fixation: "+",
  font_size:  46,
  position: 3,
  background_images: background
}

var vaast_first_step_training_1 = {
  type: 'vaast-image',
  stimulus: jsPsych.timelineVariable('stimulus'),
  position: 3,
  background_images: background,
  font_sizes:  image_sizes,
  approach_key: "y",
  avoidance_key: "n",
  stim_movement: jsPsych.timelineVariable('movement_1'),
  html_when_wrong: '<span style="color: red; font-size: 80px">&times;</span>',
  force_correct_key_press: true,
  display_feedback: true,
  response_ends_trial: true
}

var vaast_second_step_training_1 = {
  type: 'vaast-image',
  stimulus: jsPsych.timelineVariable('stimulus'),
  position: next_position_training,
  background_images: background,
  font_sizes:  image_sizes,
  approach_key: "y",
  avoidance_key: "n",
  stim_movement: jsPsych.timelineVariable('movement_1'),
  html_when_wrong: '<span style="color: red; font-size: 80px">&times;</span>',
  force_correct_key_press: true,
  display_feedback: true,
  response_ends_trial: true
}

var vaast_third_step_training_1 = {
  type: 'vaast-image',
  stimulus: jsPsych.timelineVariable('stimulus'),
  position: next_position_training,
  background_images: background,
  font_sizes:  image_sizes,
  approach_key: "y",
  avoidance_key: "n",
  stim_movement: jsPsych.timelineVariable('movement_1'),
  html_when_wrong: '<span style="color: red; font-size: 80px">&times;</span>',
  force_correct_key_press: true,
  display_feedback: true,
  response_ends_trial: true
}

var vaast_fourth_step_training_1 = {
  type: 'vaast-image',
  position: next_position_training,
  stimulus: jsPsych.timelineVariable('stimulus'),
  background_images: background,
  font_sizes:  image_sizes,
  stim_movement: jsPsych.timelineVariable('movement_1'),
  response_ends_trial: false,
  trial_duration: 650
}


var vaast_first_step_training_2 = {
  type: 'vaast-image',
  stimulus: jsPsych.timelineVariable('stimulus'),
  position: 3,
  background_images: background,
  font_sizes:  image_sizes,
  approach_key: "y",
  avoidance_key: "n",
  stim_movement: jsPsych.timelineVariable('movement_2'),
  html_when_wrong: '<span style="color: red; font-size: 80px">&times;</span>',
  force_correct_key_press: true,
  display_feedback: true,
  response_ends_trial: true
}

var vaast_second_step_training_2 = {
  type: 'vaast-image',
  stimulus: jsPsych.timelineVariable('stimulus'),
  position: next_position_training,
  background_images: background,
  font_sizes:  image_sizes,
  approach_key: "y",
  avoidance_key: "n",
  stim_movement: jsPsych.timelineVariable('movement_2'),
  html_when_wrong: '<span style="color: red; font-size: 80px">&times;</span>',
  force_correct_key_press: true,
  display_feedback: true,
  response_ends_trial: true
}

var vaast_third_step_training_2 = {
  type: 'vaast-image',
  stimulus: jsPsych.timelineVariable('stimulus'),
  position: next_position_training,
  background_images: background,
  font_sizes:  image_sizes,
  approach_key: "y",
  avoidance_key: "n",
  stim_movement: jsPsych.timelineVariable('movement_2'),
  html_when_wrong: '<span style="color: red; font-size: 80px">&times;</span>',
  force_correct_key_press: true,
  display_feedback: true,
  response_ends_trial: true
}

var vaast_fourth_step_training_2 = {
  type: 'vaast-image',
  position: next_position_training,
  stimulus: jsPsych.timelineVariable('stimulus'),
  background_images: background,
  font_sizes:  image_sizes,
  stim_movement: jsPsych.timelineVariable('movement_2'),
  response_ends_trial: false,
  trial_duration: 650
}


// VAAST training block -----------------------------------------------------------------

var vaast_training_block_1 = {
  timeline: [
    vaast_start,
    vaast_fixation,
    vaast_first_step_training_1,
    vaast_second_step_training_1,
    vaast_third_step_training_1,
    vaast_fourth_step_training_1,
    save_vaast_trial
  ],
  timeline_variables: vaast_stim_training,
  repetitions: 1, //here, put 2
  randomize_order: true,
  data: {
    phase:    "training",
    stimulus: jsPsych.timelineVariable('stimulus'),
    movement: jsPsych.timelineVariable('movement_1'),
    group:   jsPsych.timelineVariable('group'),
  }
};


var vaast_training_block_2 = {
  timeline: [
    vaast_start,
    vaast_fixation,
    vaast_first_step_training_2,
    vaast_second_step_training_2,
    vaast_third_step_training_2,
    vaast_fourth_step_training_2,
    save_vaast_trial
  ],
  timeline_variables: vaast_stim_training,
  repetitions: 1,  //here, put 2
  randomize_order: true,
  data: {
    phase:    "training",
    stimulus: jsPsych.timelineVariable('stimulus'),
    movement: jsPsych.timelineVariable('movement_2'),
    group:    jsPsych.timelineVariable('group'),
  }
};


var vaast_instructions_8 = {
  type: "html-keyboard-response",
  stimulus:
    "<h1 class ='custom-title'> Video Game task</h1>" +
    "<p><center>This task is completed.</center></p>" +
    "<br>" +
    "<p class = 'continue-instructions'>Press <strong>space</strong> to" +
    " continue.</p>",
  choices: [32]
};

// end fullscreen -----------------------------------------------------------------------

var fullscreen_trial_exit = {
  type: 'fullscreen',
  fullscreen_mode: false
}


// procedure ----------------------------------------------------------------------------
// Initialize timeline ------------------------------------------------------------------

var timeline = [];

// fullscreen
timeline.push(
        welcome,
        consent,
        welcome_2,
        if_not_enough_time,
        fullscreen_trial,
			  hiding_cursor);

// prolific verification
timeline.push(save_id);

timeline.push(vaast_instructions_1,
                  vaast_instructions_2,
                  vaast_instructions_2_1,
                  vaast_instructions_3, 
                  vaast_instructions_4,
                  vaast_training_block_1,
                  vaast_instructions_5,
                  vaast_instructions_6,
                  vaast_training_block_2,
                  vaast_instructions_7,
                  vaast_instructions_8);

timeline.push(showing_cursor);

timeline.push(fullscreen_trial_exit);

// Launch experiment --------------------------------------------------------------------
// preloading ---------------------------------------------------------------------------
// Preloading. For some reason, it appears auto-preloading fails, so using it manually.
// In principle, it should have ended when participants starts VAAST procedure (which)
// contains most of the image that have to be pre-loaded.
var loading_gif               = ["media/loading.gif"]
var vaast_instructions_images = ["media/vaast-background.png", "media/keyboard-vaastt.png"];
var vaast_bg_filename         = background;

jsPsych.pluginAPI.preloadImages(loading_gif);
jsPsych.pluginAPI.preloadImages(vaast_instructions_images);
jsPsych.pluginAPI.preloadImages(vaast_bg_filename);

// timeline initiaization ---------------------------------------------------------------

if(is_compatible) {
  jsPsych.init({
      timeline: timeline,
      on_interaction_data_update: function() {
        saving_browser_events(completion = false);
      },
    on_finish: function() {
        saving_browser_events(completion = true);
        window.location.href = "https://uclpsychology.co1.qualtrics.com/jfe/form/SV_0NRoqjK0V6IpikJ?jspsych_id=" + jspsych_id + "?prolificID="+ 
        prolificID;
    }
  });
}


