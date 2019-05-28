  // LICENCE -----------------------------------------------------------------------------
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
  // safari exclusion ---------------------------------------------------------------------
  var is_safari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  var is_ie = /*@cc_on!@*/false || !!document.documentMode;

  var is_compatible = !(is_safari || is_ie);


  if(!is_compatible) {


      var exclusion = {
          type: "html-keyboard-response",
          stimulus:
          "<p>Unfortunately, this study is not compatible with your " +
          "browser.</p>" +
          "<p>Please reopen this experiment from a supported browser (like " +
          "Chrome or Firefox).</p>",
          choices: jsPsych.NO_KEYS
      };

      var timeline_exclusion = [];

      timeline_exclusion.push(exclusion);
      jsPsych.init({timeline: timeline_safari});

  }
  // firebase initialization ---------------------------------------------------------------
  firebase.initializeApp(firebase_config);
  var database = firebase.database();
  var session_id  = jsPsych.randomization.randomID();

  // connection status ---------------------------------------------------------------------
  // This section ensure that we don't lose data. Anytime the 
  // client is disconnected, an alert appears onscreen
  var connectedRef = firebase.database().ref(".info/connected");
  var connection   = firebase.database().ref("connection/" + session_id + "/")
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

// Global variables:
var approach_key  = "Y";
var avoidance_key = "N";

// do something in the background
   // cursor helper functions -------------------------------------------------------------
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

  // Variable input -----------------------------------------------------------------------
  // Variable used to define experimental condition.

  var vaast_cond_block_1 = jsPsych.randomization.sampleWithoutReplacement(["approach_images_pos", "approach_images_neg", "approach_words_pos", "approach_words_neg"], 1)[0];

   if (vaast_cond_block_1 == "approach_images_pos") {
     vaast_cond_block_2 = "approach_images_neg";
     vaast_cond_block_3 = "approach_words_pos";
     vaast_cond_block_4 = "approach_words_neg";
   } else if (vaast_cond_block_1 == "approach_images_neg") {
     vaast_cond_block_2 = "approach_images_pos";
     vaast_cond_block_3 = "approach_words_neg";
     vaast_cond_block_4 = "approach_words_pos";
   } else if (vaast_cond_block_1 == "approach_words_pos") {
     vaast_cond_block_2 = "approach_words_neg";
     vaast_cond_block_3 = "approach_images_pos";
     vaast_cond_block_4 = "approach_images_neg";
   } else if (vaast_cond_block_1 == "approach_words_neg") {
     vaast_cond_block_2 = "approach_words_pos";
     vaast_cond_block_3 = "approach_images_neg";
     vaast_cond_block_4 = "approach_images_pos";
   }

  // prolific variables
  var prolific_id = jsPsych.data.getURLVariable('prolific_id');
  if(prolific_id == null) {prolific_id = "999";}

  // counter variables
  var vaast_trial_n    = 1;
  var browser_events_n = 1;

  // VAAST --------------------------------------------------------------------------------
  // VAAST variables ----------------------------------------------------------------------
  var approach_pos_1 = undefined;
  var approach_neg_1 = undefined;
  var approach_pos_2 = undefined;
  var approach_neg_2 = undefined;
  var approach_pos_3 = undefined;
  var approach_neg_3 = undefined;
  var approach_pos_4 = undefined;
  var approach_neg_4 = undefined;

  var stim_to_approach_1 = undefined;
  var stim_to_approach_2 = undefined;
  var stim_to_approach_3 = undefined;
  var stim_to_approach_4 = undefined;
  var stim_to_avoid_1    = undefined;
  var stim_to_avoid_2    = undefined;
  var stim_to_avoid_3    = undefined;
  var stim_to_avoid_4    = undefined;

  switch(vaast_cond_block_1) {
    case "approach_images_pos":
      approach_pos_1 = "approach";
      approach_neg_1 = "avoidance";
      stim_to_approach_1 = "positive images";
      stim_to_avoid_1 = "negative images";
      break;

    case "approach_images_neg":
      approach_pos_1 = "avoidance";
      approach_neg_1 = "approach";
      stim_to_approach_1 = "negative images";
      stim_to_avoid_1 = "positive images";
      break;

    case "approach_words_pos":
      approach_pos_1 = "approach";
      approach_neg_1 = "avoidance";
      stim_to_approach_1 = "positive words";
      stim_to_avoid_1 = "negative words";
      break;

    case "approach_words_neg":
      approach_pos_1 = "avoidance";
      approach_neg_1 = "approach";
      stim_to_approach_1 = "negative words";
      stim_to_avoid_1 = "positive words";
      break;
  }

  switch(vaast_cond_block_2) {
    case "approach_images_pos":
      approach_pos_2 = "approach";
      approach_neg_2 = "avoidance";
      stim_to_approach_2 = "positive images";
      stim_to_avoid_2 = "negative images";
      break;

    case "approach_images_neg":
      approach_pos_2 = "avoidance";
      approach_neg_2 = "approach";
      stim_to_approach_2 = "negative images";
      stim_to_avoid_2 = "positive images";
      break;

    case "approach_words_pos":
      approach_pos_2 = "approach";
      approach_neg_2 = "avoidance";
      stim_to_approach_2 = "positive words";
      stim_to_avoid_2 = "negative words";
      break;

    case "approach_words_neg":
      approach_pos_2 = "avoidance";
      approach_neg_2 = "approach";
      stim_to_approach_2 = "negative words";
      stim_to_avoid_2 = "positive words";
      break;
  }

  switch(vaast_cond_block_3) {
    case "approach_images_pos":
      approach_pos_3 = "approach";
      approach_neg_3 = "avoidance";
      stim_to_approach_3 = "positive images";
      stim_to_avoid_3 = "negative images";
      break;

    case "approach_images_neg":
      approach_pos_3 = "avoidance";
      approach_neg_3 = "approach";
      stim_to_approach_3 = "negative images";
      stim_to_avoid_3 = "positive images";
      break;

    case "approach_words_pos":
      approach_pos_3 = "approach";
      approach_neg_3 = "avoidance";
      stim_to_approach_3 = "positive words";
      stim_to_avoid_3 = "negative words";
      break;

    case "approach_words_neg":
      approach_pos_3 = "avoidance";
      approach_neg_3 = "approach";
      stim_to_approach_3 = "negative words";
      stim_to_avoid_3 = "positive words";
      break;
  }

  switch(vaast_cond_block_4) {
    case "approach_images_pos":
      approach_pos_4 = "approach";
      approach_neg_4 = "avoidance";
      stim_to_approach_4 = "positive images";
      stim_to_avoid_4 = "negative images";
      break;

    case "approach_images_neg":
      approach_pos_4 = "avoidance";
      approach_neg_4 = "approach";
      stim_to_approach_4 = "negative images";
      stim_to_avoid_4 = "positive images";
      break;

    case "approach_words_pos":
      approach_pos_4 = "approach";
      approach_neg_4 = "avoidance";
      stim_to_approach_4 = "positive words";
      stim_to_avoid_4 = "negative words";
      break;

    case "approach_words_neg":
      approach_pos_4 = "avoidance";
      approach_neg_4 = "approach";
      stim_to_approach_4 = "negative words";
      stim_to_avoid_4 = "positive words";
      break;
  }

  // VAAST stimuli ------------------------------------------------------------------------
  // vaast image stimuli ------------------------------------------------------------------
  var vaast_stim_training_block_1_images = [
    {stimulus: 'stimuli/apple_2.jpg',     category: "approach_words_pos", movement: approach_pos_1},
    {stimulus: 'stimuli/beach_3.jpg',     category: "approach_words_pos", movement: approach_pos_1},
    {stimulus: 'stimuli/bed_1.jpg',       category: "approach_words_pos", movement: approach_pos_1},
    {stimulus: 'stimuli/cake_1.jpg',      category: "approach_words_pos", movement: approach_pos_1},
    {stimulus: 'stimuli/chocolate_2.jpg', category: "approach_words_pos", movement: approach_pos_1},
    {stimulus: 'stimuli/acne_2.jpg',      category: "approach_words_neg", movement: approach_neg_1},
    {stimulus: 'stimuli/blood_1.jpg',     category: "approach_words_neg", movement: approach_neg_1},
    {stimulus: 'stimuli/cockroach_3.jpg', category: "approach_words_neg", movement: approach_neg_1},
    {stimulus: 'stimuli/coffin_2.jpg',    category: "approach_words_neg", movement: approach_neg_1},
    {stimulus: 'stimuli/corpse_3.jpg',    category: "approach_words_neg", movement: approach_neg_1},
  ];

  var vaast_stim_training_block_1_words = [
    {stimulus: 'apple',     category: "approach_words_pos", movement: approach_pos_1},
    {stimulus: 'beach',     category: "approach_words_pos", movement: approach_pos_1},
    {stimulus: 'bed',       category: "approach_words_pos", movement: approach_pos_1},
    {stimulus: 'cake',      category: "approach_words_pos", movement: approach_pos_1},
    {stimulus: 'chocolate', category: "approach_words_pos", movement: approach_pos_1},
    {stimulus: 'acne',      category: "approach_words_neg", movement: approach_neg_1},
    {stimulus: 'blood',     category: "approach_words_neg", movement: approach_neg_1},
    {stimulus: 'cockroach', category: "approach_words_neg", movement: approach_neg_1},
    {stimulus: 'coffin',    category: "approach_words_neg", movement: approach_neg_1},
    {stimulus: 'corpse',    category: "approach_words_neg", movement: approach_neg_1},
  ];
  
  var vaast_stim_block_1_images = [
    {stimulus: 'stimuli/christmas_3.jpg',  category: "approach_words_pos",  movement: approach_pos_1},
    {stimulus: 'stimuli/cookies_2.jpg',    category: "approach_words_pos",  movement: approach_pos_1},
    {stimulus: 'stimuli/cupcake_3.jpg',    category: "approach_words_pos",  movement: approach_pos_1},
    {stimulus: 'stimuli/deer_2.jpg',       category: "approach_words_pos",  movement: approach_pos_1},
    {stimulus: 'stimuli/fireworks_2.jpg',  category: "approach_words_pos",  movement: approach_pos_1},
    {stimulus: 'stimuli/flower_1.jpg',     category: "approach_words_pos",  movement: approach_pos_1},
    {stimulus: 'stimuli/marriage_2.jpg',   category: "approach_words_pos",  movement: approach_pos_1},
    {stimulus: 'stimuli/meditation_1.jpg', category: "approach_words_pos",  movement: approach_pos_1},
    {stimulus: 'stimuli/mountain_1.jpg',   category: "approach_words_pos",  movement: approach_pos_1},
    {stimulus: 'stimuli/pie_3.jpg',        category: "approach_words_pos",  movement: approach_pos_1},
    {stimulus: 'stimuli/pizza_4.jpg',      category: "approach_words_pos",  movement: approach_pos_1},
    {stimulus: 'stimuli/prairie_1.jpg',    category: "approach_words_pos",  movement: approach_pos_1},
    {stimulus: 'stimuli/puppy_4.jpg',      category: "approach_words_pos",  movement: approach_pos_1},
    {stimulus: 'stimuli/rabbit_2.jpg',     category: "approach_words_pos",  movement: approach_pos_1},
    {stimulus: 'stimuli/rainbow_1.jpg',    category: "approach_words_pos",  movement: approach_pos_1},
    {stimulus: 'stimuli/raspberry_1.jpg',  category: "approach_words_pos",  movement: approach_pos_1},
    {stimulus: 'stimuli/spaghetti_2.jpg',  category: "approach_words_pos",  movement: approach_pos_1},
    {stimulus: 'stimuli/strawberry_1.jpg', category: "approach_words_pos",  movement: approach_pos_1},
    {stimulus: 'stimuli/sunset_3.jpg',     category: "approach_words_pos",  movement: approach_pos_1},
    {stimulus: 'stimuli/waterfall_1.jpg',  category: "approach_words_pos",  movement: approach_pos_1},
    {stimulus: 'stimuli/devil_1.jpg',      category: "approach_words_neg",  movement: approach_neg_1},
    {stimulus: 'stimuli/explosion_1.jpg',  category: "approach_words_neg",  movement: approach_neg_1},
    {stimulus: 'stimuli/feces_2.jpg',      category: "approach_words_neg",  movement: approach_neg_1},
    {stimulus: 'stimuli/flood_1.jpg',      category: "approach_words_neg",  movement: approach_neg_1},
    {stimulus: 'stimuli/gun_1.jpg',        category: "approach_words_neg",  movement: approach_neg_1},
    {stimulus: 'stimuli/homeless_2.jpg',   category: "approach_words_neg",  movement: approach_neg_1},
    {stimulus: 'stimuli/hurricane_2.jpg',  category: "approach_words_neg",  movement: approach_neg_1},
    {stimulus: 'stimuli/jail_1.jpg',       category: "approach_words_neg",  movement: approach_neg_1},
    {stimulus: 'stimuli/knife_1.jpg',      category: "approach_words_neg",  movement: approach_neg_1},
    {stimulus: 'stimuli/mutilation_1.jpg', category: "approach_words_neg",  movement: approach_neg_1},
    {stimulus: 'stimuli/pollution_1.jpg',  category: "approach_words_neg",  movement: approach_neg_1},
    {stimulus: 'stimuli/rat_3.jpg',        category: "approach_words_neg",  movement: approach_neg_1},
    {stimulus: 'stimuli/rifle_3.jpg',      category: "approach_words_neg",  movement: approach_neg_1},
    {stimulus: 'stimuli/shark_2.jpg',      category: "approach_words_neg",  movement: approach_neg_1},
    {stimulus: 'stimuli/sick_2.jpg',       category: "approach_words_neg",  movement: approach_neg_1},
    {stimulus: 'stimuli/snake_3.jpg',      category: "approach_words_neg",  movement: approach_neg_1},
    {stimulus: 'stimuli/spider_3.jpg',     category: "approach_words_neg",  movement: approach_neg_1},
    {stimulus: 'stimuli/suicide_1.jpg',    category: "approach_words_neg",  movement: approach_neg_1},
    {stimulus: 'stimuli/war_2.jpg',        category: "approach_words_neg",  movement: approach_neg_1},
    {stimulus: 'stimuli/worm_2.jpg',       category: "approach_words_neg",  movement: approach_neg_1},
  ];

  var vaast_stim_block_1_words = [
    {stimulus: 'christmas',  category: "approach_words_pos",  movement: approach_pos_1},
    {stimulus: 'cookies',    category: "approach_words_pos",  movement: approach_pos_1},
    {stimulus: 'cupcake',    category: "approach_words_pos",  movement: approach_pos_1},
    {stimulus: 'deer',       category: "approach_words_pos",  movement: approach_pos_1},
    {stimulus: 'fireworks',  category: "approach_words_pos",  movement: approach_pos_1},
    {stimulus: 'flower',     category: "approach_words_pos",  movement: approach_pos_1},
    {stimulus: 'marriage',   category: "approach_words_pos",  movement: approach_pos_1},
    {stimulus: 'meditation', category: "approach_words_pos",  movement: approach_pos_1},
    {stimulus: 'mountain',   category: "approach_words_pos",  movement: approach_pos_1},
    {stimulus: 'pie',        category: "approach_words_pos",  movement: approach_pos_1},
    {stimulus: 'pizza',      category: "approach_words_pos",  movement: approach_pos_1},
    {stimulus: 'prairie',    category: "approach_words_pos",  movement: approach_pos_1},
    {stimulus: 'puppy',      category: "approach_words_pos",  movement: approach_pos_1},
    {stimulus: 'rabbit',     category: "approach_words_pos",  movement: approach_pos_1},
    {stimulus: 'rainbow',    category: "approach_words_pos",  movement: approach_pos_1},
    {stimulus: 'raspberry',  category: "approach_words_pos",  movement: approach_pos_1},
    {stimulus: 'spaghetti',  category: "approach_words_pos",  movement: approach_pos_1},
    {stimulus: 'strawberry', category: "approach_words_pos",  movement: approach_pos_1},
    {stimulus: 'sunset',     category: "approach_words_pos",  movement: approach_pos_1},
    {stimulus: 'waterfall',  category: "approach_words_pos",  movement: approach_pos_1},
    {stimulus: 'devil',      category: "approach_words_neg",  movement: approach_neg_1},
    {stimulus: 'explosion',  category: "approach_words_neg",  movement: approach_neg_1},
    {stimulus: 'feces',      category: "approach_words_neg",  movement: approach_neg_1},
    {stimulus: 'flood',      category: "approach_words_neg",  movement: approach_neg_1},
    {stimulus: 'gun',        category: "approach_words_neg",  movement: approach_neg_1},
    {stimulus: 'homeless',   category: "approach_words_neg",  movement: approach_neg_1},
    {stimulus: 'hurricane',  category: "approach_words_neg",  movement: approach_neg_1},
    {stimulus: 'jail',       category: "approach_words_neg",  movement: approach_neg_1},
    {stimulus: 'knife',      category: "approach_words_neg",  movement: approach_neg_1},
    {stimulus: 'mutilation', category: "approach_words_neg",  movement: approach_neg_1},
    {stimulus: 'pollution',  category: "approach_words_neg",  movement: approach_neg_1},
    {stimulus: 'rat',        category: "approach_words_neg",  movement: approach_neg_1},
    {stimulus: 'rifle',      category: "approach_words_neg",  movement: approach_neg_1},
    {stimulus: 'shark',      category: "approach_words_neg",  movement: approach_neg_1},
    {stimulus: 'sick',       category: "approach_words_neg",  movement: approach_neg_1},
    {stimulus: 'snake',      category: "approach_words_neg",  movement: approach_neg_1},
    {stimulus: 'spider',     category: "approach_words_neg",  movement: approach_neg_1},
    {stimulus: 'suicide',    category: "approach_words_neg",  movement: approach_neg_1},
    {stimulus: 'war',        category: "approach_words_neg",  movement: approach_neg_1},
    {stimulus: 'worm',       category: "approach_words_neg",  movement: approach_neg_1},
  ];

  var vaast_stim_training_block_2_images = [
    {stimulus: 'stimuli/apple_2.jpg',     category: "approach_words_pos", movement: approach_pos_2},
    {stimulus: 'stimuli/beach_3.jpg',     category: "approach_words_pos", movement: approach_pos_2},
    {stimulus: 'stimuli/bed_1.jpg',       category: "approach_words_pos", movement: approach_pos_2},
    {stimulus: 'stimuli/cake_1.jpg',      category: "approach_words_pos", movement: approach_pos_2},
    {stimulus: 'stimuli/chocolate_2.jpg', category: "approach_words_pos", movement: approach_pos_2},
    {stimulus: 'stimuli/acne_2.jpg',      category: "approach_words_neg", movement: approach_neg_2},
    {stimulus: 'stimuli/blood_1.jpg',     category: "approach_words_neg", movement: approach_neg_2},
    {stimulus: 'stimuli/cockroach_3.jpg', category: "approach_words_neg", movement: approach_neg_2},
    {stimulus: 'stimuli/coffin_2.jpg',    category: "approach_words_neg", movement: approach_neg_2},
    {stimulus: 'stimuli/corpse_3.jpg',    category: "approach_words_neg", movement: approach_neg_2},
  ];

  var vaast_stim_training_block_2_words = [
    {stimulus: 'apple',     category: "approach_words_pos", movement: approach_pos_2},
    {stimulus: 'beach',     category: "approach_words_pos", movement: approach_pos_2},
    {stimulus: 'bed',       category: "approach_words_pos", movement: approach_pos_2},
    {stimulus: 'cake',      category: "approach_words_pos", movement: approach_pos_2},
    {stimulus: 'chocolate', category: "approach_words_pos", movement: approach_pos_2},
    {stimulus: 'acne',      category: "approach_words_neg", movement: approach_neg_2},
    {stimulus: 'blood',     category: "approach_words_neg", movement: approach_neg_2},
    {stimulus: 'cockroach', category: "approach_words_neg", movement: approach_neg_2},
    {stimulus: 'coffin',    category: "approach_words_neg", movement: approach_neg_2},
    {stimulus: 'corpse',    category: "approach_words_neg", movement: approach_neg_2},
  ];

  var vaast_stim_block_2_images = [
    {stimulus: 'stimuli/christmas_3.jpg',  category: "approach_words_pos",  movement: approach_pos_2},
    {stimulus: 'stimuli/cookies_2.jpg',    category: "approach_words_pos",  movement: approach_pos_2},
    {stimulus: 'stimuli/cupcake_3.jpg',    category: "approach_words_pos",  movement: approach_pos_2},
    {stimulus: 'stimuli/deer_2.jpg',       category: "approach_words_pos",  movement: approach_pos_2},
    {stimulus: 'stimuli/fireworks_2.jpg',  category: "approach_words_pos",  movement: approach_pos_2},
    {stimulus: 'stimuli/flower_1.jpg',     category: "approach_words_pos",  movement: approach_pos_2},
    {stimulus: 'stimuli/marriage_2.jpg',   category: "approach_words_pos",  movement: approach_pos_2},
    {stimulus: 'stimuli/meditation_1.jpg', category: "approach_words_pos",  movement: approach_pos_2},
    {stimulus: 'stimuli/mountain_1.jpg',   category: "approach_words_pos",  movement: approach_pos_2},
    {stimulus: 'stimuli/pie_3.jpg',        category: "approach_words_pos",  movement: approach_pos_2},
    {stimulus: 'stimuli/pizza_4.jpg',      category: "approach_words_pos",  movement: approach_pos_2},
    {stimulus: 'stimuli/prairie_1.jpg',    category: "approach_words_pos",  movement: approach_pos_2},
    {stimulus: 'stimuli/puppy_4.jpg',      category: "approach_words_pos",  movement: approach_pos_2},
    {stimulus: 'stimuli/rabbit_2.jpg',     category: "approach_words_pos",  movement: approach_pos_2},
    {stimulus: 'stimuli/rainbow_1.jpg',    category: "approach_words_pos",  movement: approach_pos_2},
    {stimulus: 'stimuli/raspberry_1.jpg',  category: "approach_words_pos",  movement: approach_pos_2},
    {stimulus: 'stimuli/spaghetti_2.jpg',  category: "approach_words_pos",  movement: approach_pos_2},
    {stimulus: 'stimuli/strawberry_1.jpg', category: "approach_words_pos",  movement: approach_pos_2},
    {stimulus: 'stimuli/sunset_3.jpg',     category: "approach_words_pos",  movement: approach_pos_2},
    {stimulus: 'stimuli/waterfall_1.jpg',  category: "approach_words_pos",  movement: approach_pos_2},
    {stimulus: 'stimuli/devil_1.jpg',      category: "approach_words_neg",  movement: approach_neg_2},
    {stimulus: 'stimuli/explosion_1.jpg',  category: "approach_words_neg",  movement: approach_neg_2},
    {stimulus: 'stimuli/feces_2.jpg',      category: "approach_words_neg",  movement: approach_neg_2},
    {stimulus: 'stimuli/flood_1.jpg',      category: "approach_words_neg",  movement: approach_neg_2},
    {stimulus: 'stimuli/gun_1.jpg',        category: "approach_words_neg",  movement: approach_neg_2},
    {stimulus: 'stimuli/homeless_2.jpg',   category: "approach_words_neg",  movement: approach_neg_2},
    {stimulus: 'stimuli/hurricane_2.jpg',  category: "approach_words_neg",  movement: approach_neg_2},
    {stimulus: 'stimuli/jail_1.jpg',       category: "approach_words_neg",  movement: approach_neg_2},
    {stimulus: 'stimuli/knife_1.jpg',      category: "approach_words_neg",  movement: approach_neg_2},
    {stimulus: 'stimuli/mutilation_1.jpg', category: "approach_words_neg",  movement: approach_neg_2},
    {stimulus: 'stimuli/pollution_1.jpg',  category: "approach_words_neg",  movement: approach_neg_2},
    {stimulus: 'stimuli/rat_3.jpg',        category: "approach_words_neg",  movement: approach_neg_2},
    {stimulus: 'stimuli/rifle_3.jpg',      category: "approach_words_neg",  movement: approach_neg_2},
    {stimulus: 'stimuli/shark_2.jpg',      category: "approach_words_neg",  movement: approach_neg_2},
    {stimulus: 'stimuli/sick_2.jpg',       category: "approach_words_neg",  movement: approach_neg_2},
    {stimulus: 'stimuli/snake_3.jpg',      category: "approach_words_neg",  movement: approach_neg_2},
    {stimulus: 'stimuli/spider_3.jpg',     category: "approach_words_neg",  movement: approach_neg_2},
    {stimulus: 'stimuli/suicide_1.jpg',    category: "approach_words_neg",  movement: approach_neg_2},
    {stimulus: 'stimuli/war_2.jpg',        category: "approach_words_neg",  movement: approach_neg_2},
    {stimulus: 'stimuli/worm_2.jpg',       category: "approach_words_neg",  movement: approach_neg_2},
  ];

  var vaast_stim_block_2_words = [
    {stimulus: 'christmas',  category: "approach_words_pos",  movement: approach_pos_2},
    {stimulus: 'cookies',    category: "approach_words_pos",  movement: approach_pos_2},
    {stimulus: 'cupcake',    category: "approach_words_pos",  movement: approach_pos_2},
    {stimulus: 'deer',       category: "approach_words_pos",  movement: approach_pos_2},
    {stimulus: 'fireworks',  category: "approach_words_pos",  movement: approach_pos_2},
    {stimulus: 'flower',     category: "approach_words_pos",  movement: approach_pos_2},
    {stimulus: 'marriage',   category: "approach_words_pos",  movement: approach_pos_2},
    {stimulus: 'meditation', category: "approach_words_pos",  movement: approach_pos_2},
    {stimulus: 'mountain',   category: "approach_words_pos",  movement: approach_pos_2},
    {stimulus: 'pie',        category: "approach_words_pos",  movement: approach_pos_2},
    {stimulus: 'pizza',      category: "approach_words_pos",  movement: approach_pos_2},
    {stimulus: 'prairie',    category: "approach_words_pos",  movement: approach_pos_2},
    {stimulus: 'puppy',      category: "approach_words_pos",  movement: approach_pos_2},
    {stimulus: 'rabbit',     category: "approach_words_pos",  movement: approach_pos_2},
    {stimulus: 'rainbow',    category: "approach_words_pos",  movement: approach_pos_2},
    {stimulus: 'raspberry',  category: "approach_words_pos",  movement: approach_pos_2},
    {stimulus: 'spaghetti',  category: "approach_words_pos",  movement: approach_pos_2},
    {stimulus: 'strawberry', category: "approach_words_pos",  movement: approach_pos_2},
    {stimulus: 'sunset',     category: "approach_words_pos",  movement: approach_pos_2},
    {stimulus: 'waterfall',  category: "approach_words_pos",  movement: approach_pos_2},
    {stimulus: 'devil',      category: "approach_words_neg",  movement: approach_neg_2},
    {stimulus: 'explosion',  category: "approach_words_neg",  movement: approach_neg_2},
    {stimulus: 'feces',      category: "approach_words_neg",  movement: approach_neg_2},
    {stimulus: 'flood',      category: "approach_words_neg",  movement: approach_neg_2},
    {stimulus: 'gun',        category: "approach_words_neg",  movement: approach_neg_2},
    {stimulus: 'homeless',   category: "approach_words_neg",  movement: approach_neg_2},
    {stimulus: 'hurricane',  category: "approach_words_neg",  movement: approach_neg_2},
    {stimulus: 'jail',       category: "approach_words_neg",  movement: approach_neg_2},
    {stimulus: 'knife',      category: "approach_words_neg",  movement: approach_neg_2},
    {stimulus: 'mutilation', category: "approach_words_neg",  movement: approach_neg_2},
    {stimulus: 'pollution',  category: "approach_words_neg",  movement: approach_neg_2},
    {stimulus: 'rat',        category: "approach_words_neg",  movement: approach_neg_2},
    {stimulus: 'rifle',      category: "approach_words_neg",  movement: approach_neg_2},
    {stimulus: 'shark',      category: "approach_words_neg",  movement: approach_neg_2},
    {stimulus: 'sick',       category: "approach_words_neg",  movement: approach_neg_2},
    {stimulus: 'snake',      category: "approach_words_neg",  movement: approach_neg_2},
    {stimulus: 'spider',     category: "approach_words_neg",  movement: approach_neg_2},
    {stimulus: 'suicide',    category: "approach_words_neg",  movement: approach_neg_2},
    {stimulus: 'war',        category: "approach_words_neg",  movement: approach_neg_2},
    {stimulus: 'worm',       category: "approach_words_neg",  movement: approach_neg_2},
  ];

  var vaast_stim_training_block_3_images = [
    {stimulus: 'stimuli/apple_2.jpg',     category: "approach_words_pos", movement: approach_pos_3},
    {stimulus: 'stimuli/beach_3.jpg',     category: "approach_words_pos", movement: approach_pos_3},
    {stimulus: 'stimuli/bed_1.jpg',       category: "approach_words_pos", movement: approach_pos_3},
    {stimulus: 'stimuli/cake_1.jpg',      category: "approach_words_pos", movement: approach_pos_3},
    {stimulus: 'stimuli/chocolate_2.jpg', category: "approach_words_pos", movement: approach_pos_3},
    {stimulus: 'stimuli/acne_2.jpg',      category: "approach_words_neg", movement: approach_neg_3},
    {stimulus: 'stimuli/blood_1.jpg',     category: "approach_words_neg", movement: approach_neg_3},
    {stimulus: 'stimuli/cockroach_3.jpg', category: "approach_words_neg", movement: approach_neg_3},
    {stimulus: 'stimuli/coffin_2.jpg',    category: "approach_words_neg", movement: approach_neg_3},
    {stimulus: 'stimuli/corpse_3.jpg',    category: "approach_words_neg", movement: approach_neg_3},
  ];

  var vaast_stim_training_block_3_words = [
    {stimulus: 'apple',     category: "approach_words_pos", movement: approach_pos_3},
    {stimulus: 'beach',     category: "approach_words_pos", movement: approach_pos_3},
    {stimulus: 'bed',       category: "approach_words_pos", movement: approach_pos_3},
    {stimulus: 'cake',      category: "approach_words_pos", movement: approach_pos_3},
    {stimulus: 'chocolate', category: "approach_words_pos", movement: approach_pos_3},
    {stimulus: 'acne',      category: "approach_words_neg", movement: approach_neg_3},
    {stimulus: 'blood',     category: "approach_words_neg", movement: approach_neg_3},
    {stimulus: 'cockroach', category: "approach_words_neg", movement: approach_neg_3},
    {stimulus: 'coffin',    category: "approach_words_neg", movement: approach_neg_3},
    {stimulus: 'corpse',    category: "approach_words_neg", movement: approach_neg_3},
  ];

  var vaast_stim_block_3_images = [
    {stimulus: 'stimuli/christmas_3.jpg',  category: "approach_words_pos",  movement: approach_pos_3},
    {stimulus: 'stimuli/cookies_2.jpg',    category: "approach_words_pos",  movement: approach_pos_3},
    {stimulus: 'stimuli/cupcake_3.jpg',    category: "approach_words_pos",  movement: approach_pos_3},
    {stimulus: 'stimuli/deer_2.jpg',       category: "approach_words_pos",  movement: approach_pos_3},
    {stimulus: 'stimuli/fireworks_2.jpg',  category: "approach_words_pos",  movement: approach_pos_3},
    {stimulus: 'stimuli/flower_1.jpg',     category: "approach_words_pos",  movement: approach_pos_3},
    {stimulus: 'stimuli/marriage_2.jpg',   category: "approach_words_pos",  movement: approach_pos_3},
    {stimulus: 'stimuli/meditation_1.jpg', category: "approach_words_pos",  movement: approach_pos_3},
    {stimulus: 'stimuli/mountain_1.jpg',   category: "approach_words_pos",  movement: approach_pos_3},
    {stimulus: 'stimuli/pie_3.jpg',        category: "approach_words_pos",  movement: approach_pos_3},
    {stimulus: 'stimuli/pizza_4.jpg',      category: "approach_words_pos",  movement: approach_pos_3},
    {stimulus: 'stimuli/prairie_1.jpg',    category: "approach_words_pos",  movement: approach_pos_3},
    {stimulus: 'stimuli/puppy_4.jpg',      category: "approach_words_pos",  movement: approach_pos_3},
    {stimulus: 'stimuli/rabbit_2.jpg',     category: "approach_words_pos",  movement: approach_pos_3},
    {stimulus: 'stimuli/rainbow_1.jpg',    category: "approach_words_pos",  movement: approach_pos_3},
    {stimulus: 'stimuli/raspberry_1.jpg',  category: "approach_words_pos",  movement: approach_pos_3},
    {stimulus: 'stimuli/spaghetti_2.jpg',  category: "approach_words_pos",  movement: approach_pos_3},
    {stimulus: 'stimuli/strawberry_1.jpg', category: "approach_words_pos",  movement: approach_pos_3},
    {stimulus: 'stimuli/sunset_3.jpg',     category: "approach_words_pos",  movement: approach_pos_3},
    {stimulus: 'stimuli/waterfall_1.jpg',  category: "approach_words_pos",  movement: approach_pos_3},
    {stimulus: 'stimuli/devil_1.jpg',      category: "approach_words_neg",  movement: approach_neg_3},
    {stimulus: 'stimuli/explosion_1.jpg',  category: "approach_words_neg",  movement: approach_neg_3},
    {stimulus: 'stimuli/feces_2.jpg',      category: "approach_words_neg",  movement: approach_neg_3},
    {stimulus: 'stimuli/flood_1.jpg',      category: "approach_words_neg",  movement: approach_neg_3},
    {stimulus: 'stimuli/gun_1.jpg',        category: "approach_words_neg",  movement: approach_neg_3},
    {stimulus: 'stimuli/homeless_2.jpg',   category: "approach_words_neg",  movement: approach_neg_3},
    {stimulus: 'stimuli/hurricane_2.jpg',  category: "approach_words_neg",  movement: approach_neg_3},
    {stimulus: 'stimuli/jail_1.jpg',       category: "approach_words_neg",  movement: approach_neg_3},
    {stimulus: 'stimuli/knife_1.jpg',      category: "approach_words_neg",  movement: approach_neg_3},
    {stimulus: 'stimuli/mutilation_1.jpg', category: "approach_words_neg",  movement: approach_neg_3},
    {stimulus: 'stimuli/pollution_1.jpg',  category: "approach_words_neg",  movement: approach_neg_3},
    {stimulus: 'stimuli/rat_3.jpg',        category: "approach_words_neg",  movement: approach_neg_3},
    {stimulus: 'stimuli/rifle_3.jpg',      category: "approach_words_neg",  movement: approach_neg_3},
    {stimulus: 'stimuli/shark_2.jpg',      category: "approach_words_neg",  movement: approach_neg_3},
    {stimulus: 'stimuli/sick_2.jpg',       category: "approach_words_neg",  movement: approach_neg_3},
    {stimulus: 'stimuli/snake_3.jpg',      category: "approach_words_neg",  movement: approach_neg_3},
    {stimulus: 'stimuli/spider_3.jpg',     category: "approach_words_neg",  movement: approach_neg_3},
    {stimulus: 'stimuli/suicide_1.jpg',    category: "approach_words_neg",  movement: approach_neg_3},
    {stimulus: 'stimuli/war_2.jpg',        category: "approach_words_neg",  movement: approach_neg_3},
    {stimulus: 'stimuli/worm_2.jpg',       category: "approach_words_neg",  movement: approach_neg_3},
  ];

  var vaast_stim_block_3_words = [
    {stimulus: 'christmas',  category: "approach_words_pos",  movement: approach_pos_3},
    {stimulus: 'cookies',    category: "approach_words_pos",  movement: approach_pos_3},
    {stimulus: 'cupcake',    category: "approach_words_pos",  movement: approach_pos_3},
    {stimulus: 'deer',       category: "approach_words_pos",  movement: approach_pos_3},
    {stimulus: 'fireworks',  category: "approach_words_pos",  movement: approach_pos_3},
    {stimulus: 'flower',     category: "approach_words_pos",  movement: approach_pos_3},
    {stimulus: 'marriage',   category: "approach_words_pos",  movement: approach_pos_3},
    {stimulus: 'meditation', category: "approach_words_pos",  movement: approach_pos_3},
    {stimulus: 'mountain',   category: "approach_words_pos",  movement: approach_pos_3},
    {stimulus: 'pie',        category: "approach_words_pos",  movement: approach_pos_3},
    {stimulus: 'pizza',      category: "approach_words_pos",  movement: approach_pos_3},
    {stimulus: 'prairie',    category: "approach_words_pos",  movement: approach_pos_3},
    {stimulus: 'puppy',      category: "approach_words_pos",  movement: approach_pos_3},
    {stimulus: 'rabbit',     category: "approach_words_pos",  movement: approach_pos_3},
    {stimulus: 'rainbow',    category: "approach_words_pos",  movement: approach_pos_3},
    {stimulus: 'raspberry',  category: "approach_words_pos",  movement: approach_pos_3},
    {stimulus: 'spaghetti',  category: "approach_words_pos",  movement: approach_pos_3},
    {stimulus: 'strawberry', category: "approach_words_pos",  movement: approach_pos_3},
    {stimulus: 'sunset',     category: "approach_words_pos",  movement: approach_pos_3},
    {stimulus: 'waterfall',  category: "approach_words_pos",  movement: approach_pos_3},
    {stimulus: 'devil',      category: "approach_words_neg",  movement: approach_neg_3},
    {stimulus: 'explosion',  category: "approach_words_neg",  movement: approach_neg_3},
    {stimulus: 'feces',      category: "approach_words_neg",  movement: approach_neg_3},
    {stimulus: 'flood',      category: "approach_words_neg",  movement: approach_neg_3},
    {stimulus: 'gun',        category: "approach_words_neg",  movement: approach_neg_3},
    {stimulus: 'homeless',   category: "approach_words_neg",  movement: approach_neg_3},
    {stimulus: 'hurricane',  category: "approach_words_neg",  movement: approach_neg_3},
    {stimulus: 'jail',       category: "approach_words_neg",  movement: approach_neg_3},
    {stimulus: 'knife',      category: "approach_words_neg",  movement: approach_neg_3},
    {stimulus: 'mutilation', category: "approach_words_neg",  movement: approach_neg_3},
    {stimulus: 'pollution',  category: "approach_words_neg",  movement: approach_neg_3},
    {stimulus: 'rat',        category: "approach_words_neg",  movement: approach_neg_3},
    {stimulus: 'rifle',      category: "approach_words_neg",  movement: approach_neg_3},
    {stimulus: 'shark',      category: "approach_words_neg",  movement: approach_neg_3},
    {stimulus: 'sick',       category: "approach_words_neg",  movement: approach_neg_3},
    {stimulus: 'snake',      category: "approach_words_neg",  movement: approach_neg_3},
    {stimulus: 'spider',     category: "approach_words_neg",  movement: approach_neg_3},
    {stimulus: 'suicide',    category: "approach_words_neg",  movement: approach_neg_3},
    {stimulus: 'war',        category: "approach_words_neg",  movement: approach_neg_3},
    {stimulus: 'worm',       category: "approach_words_neg",  movement: approach_neg_3},
  ];

  var vaast_stim_training_block_4_images = [
    {stimulus: 'stimuli/apple_2.jpg',     category: "approach_words_pos", movement: approach_pos_4},
    {stimulus: 'stimuli/beach_3.jpg',     category: "approach_words_pos", movement: approach_pos_4},
    {stimulus: 'stimuli/bed_1.jpg',       category: "approach_words_pos", movement: approach_pos_4},
    {stimulus: 'stimuli/cake_1.jpg',      category: "approach_words_pos", movement: approach_pos_4},
    {stimulus: 'stimuli/chocolate_2.jpg', category: "approach_words_pos", movement: approach_pos_4},
    {stimulus: 'stimuli/acne_2.jpg',      category: "approach_words_neg", movement: approach_neg_4},
    {stimulus: 'stimuli/blood_1.jpg',     category: "approach_words_neg", movement: approach_neg_4},
    {stimulus: 'stimuli/cockroach_3.jpg', category: "approach_words_neg", movement: approach_neg_4},
    {stimulus: 'stimuli/coffin_2.jpg',    category: "approach_words_neg", movement: approach_neg_4},
    {stimulus: 'stimuli/corpse_3.jpg',    category: "approach_words_neg", movement: approach_neg_4},
  ];

  var vaast_stim_training_block_4_words = [
    {stimulus: 'apple',     category: "approach_words_pos", movement: approach_pos_4},
    {stimulus: 'beach',     category: "approach_words_pos", movement: approach_pos_4},
    {stimulus: 'bed',       category: "approach_words_pos", movement: approach_pos_4},
    {stimulus: 'cake',      category: "approach_words_pos", movement: approach_pos_4},
    {stimulus: 'chocolate', category: "approach_words_pos", movement: approach_pos_4},
    {stimulus: 'acne',      category: "approach_words_neg", movement: approach_neg_4},
    {stimulus: 'blood',     category: "approach_words_neg", movement: approach_neg_4},
    {stimulus: 'cockroach', category: "approach_words_neg", movement: approach_neg_4},
    {stimulus: 'coffin',    category: "approach_words_neg", movement: approach_neg_4},
    {stimulus: 'corpse',    category: "approach_words_neg", movement: approach_neg_4},
  ];

  var vaast_stim_block_4_images = [
    {stimulus: 'stimuli/christmas_3.jpg',  category: "approach_words_pos",  movement: approach_pos_4},
    {stimulus: 'stimuli/cookies_2.jpg',    category: "approach_words_pos",  movement: approach_pos_4},
    {stimulus: 'stimuli/cupcake_3.jpg',    category: "approach_words_pos",  movement: approach_pos_4},
    {stimulus: 'stimuli/deer_2.jpg',       category: "approach_words_pos",  movement: approach_pos_4},
    {stimulus: 'stimuli/fireworks_2.jpg',  category: "approach_words_pos",  movement: approach_pos_4},
    {stimulus: 'stimuli/flower_1.jpg',     category: "approach_words_pos",  movement: approach_pos_4},
    {stimulus: 'stimuli/marriage_2.jpg',   category: "approach_words_pos",  movement: approach_pos_4},
    {stimulus: 'stimuli/meditation_1.jpg', category: "approach_words_pos",  movement: approach_pos_4},
    {stimulus: 'stimuli/mountain_1.jpg',   category: "approach_words_pos",  movement: approach_pos_4},
    {stimulus: 'stimuli/pie_3.jpg',        category: "approach_words_pos",  movement: approach_pos_4},
    {stimulus: 'stimuli/pizza_4.jpg',      category: "approach_words_pos",  movement: approach_pos_4},
    {stimulus: 'stimuli/prairie_1.jpg',    category: "approach_words_pos",  movement: approach_pos_4},
    {stimulus: 'stimuli/puppy_4.jpg',      category: "approach_words_pos",  movement: approach_pos_4},
    {stimulus: 'stimuli/rabbit_2.jpg',     category: "approach_words_pos",  movement: approach_pos_4},
    {stimulus: 'stimuli/rainbow_1.jpg',    category: "approach_words_pos",  movement: approach_pos_4},
    {stimulus: 'stimuli/raspberry_1.jpg',  category: "approach_words_pos",  movement: approach_pos_4},
    {stimulus: 'stimuli/spaghetti_2.jpg',  category: "approach_words_pos",  movement: approach_pos_4},
    {stimulus: 'stimuli/strawberry_1.jpg', category: "approach_words_pos",  movement: approach_pos_4},
    {stimulus: 'stimuli/sunset_3.jpg',     category: "approach_words_pos",  movement: approach_pos_4},
    {stimulus: 'stimuli/waterfall_1.jpg',  category: "approach_words_pos",  movement: approach_pos_4},
    {stimulus: 'stimuli/devil_1.jpg',      category: "approach_words_neg",  movement: approach_neg_4},
    {stimulus: 'stimuli/explosion_1.jpg',  category: "approach_words_neg",  movement: approach_neg_4},
    {stimulus: 'stimuli/feces_2.jpg',      category: "approach_words_neg",  movement: approach_neg_4},
    {stimulus: 'stimuli/flood_1.jpg',      category: "approach_words_neg",  movement: approach_neg_4},
    {stimulus: 'stimuli/gun_1.jpg',        category: "approach_words_neg",  movement: approach_neg_4},
    {stimulus: 'stimuli/homeless_2.jpg',   category: "approach_words_neg",  movement: approach_neg_4},
    {stimulus: 'stimuli/hurricane_2.jpg',  category: "approach_words_neg",  movement: approach_neg_4},
    {stimulus: 'stimuli/jail_1.jpg',       category: "approach_words_neg",  movement: approach_neg_4},
    {stimulus: 'stimuli/knife_1.jpg',      category: "approach_words_neg",  movement: approach_neg_4},
    {stimulus: 'stimuli/mutilation_1.jpg', category: "approach_words_neg",  movement: approach_neg_4},
    {stimulus: 'stimuli/pollution_1.jpg',  category: "approach_words_neg",  movement: approach_neg_4},
    {stimulus: 'stimuli/rat_3.jpg',        category: "approach_words_neg",  movement: approach_neg_4},
    {stimulus: 'stimuli/rifle_3.jpg',      category: "approach_words_neg",  movement: approach_neg_4},
    {stimulus: 'stimuli/shark_2.jpg',      category: "approach_words_neg",  movement: approach_neg_4},
    {stimulus: 'stimuli/sick_2.jpg',       category: "approach_words_neg",  movement: approach_neg_4},
    {stimulus: 'stimuli/snake_3.jpg',      category: "approach_words_neg",  movement: approach_neg_4},
    {stimulus: 'stimuli/spider_3.jpg',     category: "approach_words_neg",  movement: approach_neg_4},
    {stimulus: 'stimuli/suicide_1.jpg',    category: "approach_words_neg",  movement: approach_neg_4},
    {stimulus: 'stimuli/war_2.jpg',        category: "approach_words_neg",  movement: approach_neg_4},
    {stimulus: 'stimuli/worm_2.jpg',       category: "approach_words_neg",  movement: approach_neg_4},
  ];

  var vaast_stim_block_4_words = [
    {stimulus: 'christmas',  category: "approach_words_pos",  movement: approach_pos_4},
    {stimulus: 'cookies',    category: "approach_words_pos",  movement: approach_pos_4},
    {stimulus: 'cupcake',    category: "approach_words_pos",  movement: approach_pos_4},
    {stimulus: 'deer',       category: "approach_words_pos",  movement: approach_pos_4},
    {stimulus: 'fireworks',  category: "approach_words_pos",  movement: approach_pos_4},
    {stimulus: 'flower',     category: "approach_words_pos",  movement: approach_pos_4},
    {stimulus: 'marriage',   category: "approach_words_pos",  movement: approach_pos_4},
    {stimulus: 'meditation', category: "approach_words_pos",  movement: approach_pos_4},
    {stimulus: 'mountain',   category: "approach_words_pos",  movement: approach_pos_4},
    {stimulus: 'pie',        category: "approach_words_pos",  movement: approach_pos_4},
    {stimulus: 'pizza',      category: "approach_words_pos",  movement: approach_pos_4},
    {stimulus: 'prairie',    category: "approach_words_pos",  movement: approach_pos_4},
    {stimulus: 'puppy',      category: "approach_words_pos",  movement: approach_pos_4},
    {stimulus: 'rabbit',     category: "approach_words_pos",  movement: approach_pos_4},
    {stimulus: 'rainbow',    category: "approach_words_pos",  movement: approach_pos_4},
    {stimulus: 'raspberry',  category: "approach_words_pos",  movement: approach_pos_4},
    {stimulus: 'spaghetti',  category: "approach_words_pos",  movement: approach_pos_4},
    {stimulus: 'strawberry', category: "approach_words_pos",  movement: approach_pos_4},
    {stimulus: 'sunset',     category: "approach_words_pos",  movement: approach_pos_4},
    {stimulus: 'waterfall',  category: "approach_words_pos",  movement: approach_pos_4},
    {stimulus: 'devil',      category: "approach_words_neg",  movement: approach_neg_4},
    {stimulus: 'explosion',  category: "approach_words_neg",  movement: approach_neg_4},
    {stimulus: 'feces',      category: "approach_words_neg",  movement: approach_neg_4},
    {stimulus: 'flood',      category: "approach_words_neg",  movement: approach_neg_4},
    {stimulus: 'gun',        category: "approach_words_neg",  movement: approach_neg_4},
    {stimulus: 'homeless',   category: "approach_words_neg",  movement: approach_neg_4},
    {stimulus: 'hurricane',  category: "approach_words_neg",  movement: approach_neg_4},
    {stimulus: 'jail',       category: "approach_words_neg",  movement: approach_neg_4},
    {stimulus: 'knife',      category: "approach_words_neg",  movement: approach_neg_4},
    {stimulus: 'mutilation', category: "approach_words_neg",  movement: approach_neg_4},
    {stimulus: 'pollution',  category: "approach_words_neg",  movement: approach_neg_4},
    {stimulus: 'rat',        category: "approach_words_neg",  movement: approach_neg_4},
    {stimulus: 'rifle',      category: "approach_words_neg",  movement: approach_neg_4},
    {stimulus: 'shark',      category: "approach_words_neg",  movement: approach_neg_4},
    {stimulus: 'sick',       category: "approach_words_neg",  movement: approach_neg_4},
    {stimulus: 'snake',      category: "approach_words_neg",  movement: approach_neg_4},
    {stimulus: 'spider',     category: "approach_words_neg",  movement: approach_neg_4},
    {stimulus: 'suicide',    category: "approach_words_neg",  movement: approach_neg_4},
    {stimulus: 'war',        category: "approach_words_neg",  movement: approach_neg_4},
    {stimulus: 'worm',       category: "approach_words_neg",  movement: approach_neg_4},
  ];


  // vaast background images --------------------------------------------------------------

  var background = [
    "background/2.jpg",
    "background/3.jpg",
    "background/4.jpg",
    "background/5.jpg",
    "background/6.jpg"
  ];


  // vaast stimuli sizes -------------------------------------------------------------------

  var word_sizes = [
    38,
    42,
    46,
    52,
    60
  ];

  var resize_factor = 7;
  var image_sizes = word_sizes.map(function(x) { return x * resize_factor; });

  // Helper functions ---------------------------------------------------------------------
  // next_position():
  // Compute next position as function of current position and correct movement. Because
  // participant have to press the correct response key, it always shows the correct
  // position.
  var next_position = function(){
    var current_position = jsPsych.data.getLastTrialData().values()[0].position;
    var current_response = jsPsych.data.getLastTrialData().values()[0].key_press;
    var position = current_position;

    var approach_keycode  = jsPsych.pluginAPI.convertKeyCharacterToKeyCode(approach_key);
    var avoidance_keycode = jsPsych.pluginAPI.convertKeyCharacterToKeyCode(avoidance_key);

    if(current_response == approach_keycode) {
      position = position + 1;
    }

    if(current_response == avoidance_keycode) {
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
        .set({session_id: session_id,
          	   prolific_id: prolific_id,
          	   timestamp: firebase.database.ServerValue.TIMESTAMP,
               vaast_cond_block_1: vaast_cond_block_1,
               vaast_cond_block_2: vaast_cond_block_2,
               vaast_cond_block_3: vaast_cond_block_3,
               vaast_cond_block_4: vaast_cond_block_4})
  }

  // vaast trial --------------------------------------------------------------------------
  var saving_vaast_trial = function(){
  	database
  	  .ref("vaast_trial/").
      push()
        .set({session_id: session_id,
          prolific_id: prolific_id,
          timestamp: firebase.database.ServerValue.TIMESTAMP,
          vaast_cond_block_1: vaast_cond_block_1,
          vaast_cond_block_2: vaast_cond_block_2,
          vaast_cond_block_3: vaast_cond_block_3,
          vaast_cond_block_4: vaast_cond_block_4,
          vaast_trial_data: jsPsych.data.get().last().json()})
  }

  var saving_extra = function() {
  	database
  	 .ref("extra_info/")
     .push()
  	 .set({session_id: session_id,
  	 	   prolific_id: prolific_id,
         timestamp: firebase.database.ServerValue.TIMESTAMP,
         vaast_cond_block_1: vaast_cond_block_1,
         vaast_cond_block_2: vaast_cond_block_2,
         vaast_cond_block_3: vaast_cond_block_3,
         vaast_cond_block_4: vaast_cond_block_4,
         extra_data: jsPsych.data.get().last().json(),
        })
  }

  var saving_browser_events = function(completion) {
  	database
  	 .ref("browser_event/")
     .push()
  	 .set({session_id: session_id,
  	 	   prolific_id: prolific_id,
         timestamp: firebase.database.ServerValue.TIMESTAMP,
         vaast_cond_block_1: vaast_cond_block_1,
         vaast_cond_block_2: vaast_cond_block_2,
         vaast_cond_block_3: vaast_cond_block_3,
         vaast_cond_block_4: vaast_cond_block_4,
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

  var save_extra = {
      type: 'call-function',
      func: saving_extra
  }

  // iat sampling function ----------------------------------------------------------------
  var sample_n = function(list, n) {
    list = jsPsych.randomization.sampleWithReplacement(list, n);
    list = jsPsych.randomization.shuffleNoRepeats(list);

    return(list);
  }
  // EXPERIMENT ---------------------------------------------------------------------------




  // initial instructions -----------------------------------------------------------------
  var welcome = {
    type: "html-keyboard-response",
    stimulus:
      "<h1 class ='custom-title'> Welcome </h1>" +
      "<p class='instructions'>Thank you for participating in this study.<p>" +
      "<p class='instructions'>During this study, you will have to complete two different tasks. We " +
      " will record your performance on these but " +
      "we will not collect any personally identifying information.</p>" +
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
      "<p class='instructions'><u>WARNING:</u> some images presented during the experiment might shock you.</p>" +
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
    message:  '<p>To take part in this study, your browser needs to be set to fullscreen.</p>',
    button_label: 'Switch to fullscreen',
    fullscreen_mode: true
  }

  // Initial instructions -----------------------------------------------------------------
  // First slide --------------------------------------------------------------------------
  var instructions = {
    type: "html-keyboard-response",
    stimulus: "<p class='instructions'>You are now about to start the study. In this study, you will engage in a task.</p>" +
    "<p class = 'continue-instructions'>Press <strong>space</strong> to start.</p>",
    choices: [32]
  };

  // VAAST instructions -------------------------------------------------------------------

  var vaast_instructions_1 = {
    type: "html-keyboard-response",
    stimulus:
      "<h1 class ='custom-title'>Video Game Task</h1>" +
      "<p class='instructions'>In this task, like in a video game you will see an environment " +
      "(presented below) in which you will be able to move forward or backward.</p>" +
      "<p class='instructions'>A word or an image will appear within this environment and " +
      "you will have to approach or avoid this word/image.</p>" +
      "<p class='instructions'><center>" +
        "<img src = 'media/vaast-background.png'>" +
      "</center></p>" +
      "<p class = 'continue-instructions'>Press <strong>space</strong> to continue.</p>",
    choices: [32]
  };

  var vaast_instructions_2 = {
    type: "html-keyboard-response",
    stimulus:
      "<p class='instructions'>In this environment you will be exposed to a series of stimuli " +
      "(words or images). Your task consists in moving forward or backward depending on the type " +
      "of stimuli (more precise instructions will be given next).</p>" +
      "<p class='instructions'> You can move in the environment bu using the the following keys " +
      "of your keyboard:</p>" +
      "<p class='instructions'><center>" +
        "<img src = 'media/keyboard-vaastt.png'>" +
      "</center></p>" +
      "<p class = 'continue-instructions'>Press <strong>space</strong> to continue.</p>",
    choices: [32]
  };

  var vaast_instructions_3 = {
    type: "html-keyboard-response",
    stimulus:
      "<p class='instructions'>At the beginning of each trial, you will see the O symbol. This symbol " +
      "indicates that you have to press the START key (namely the H key) to start the trial.</p>" +
      "<p class='instructions'>Then, you will see a fixation cross (+) at the center of the screen followed " +
      "by a word.</p>" +
      "<p class='instructions'>Your task is to move forward or backward by pressing the MOVE FORWARD " +
      "(the Y key) or MOVE BACKWARD (the N key) <strong>as fast as possible</strong>.</p>" +
      "<p class='instructions'>For all of these actions, please only use the index of your dominant hand.</p>" +
      "<p class='continue-instructions'>Press <strong>space</strong> to continue.</p>",
    choices: [32]
  };

  var vaast_instructions_training_block_1 = {
      type : "html-keyboard-response",
      stimulus:
        "<p class='instructions'><center><strong>INSTRUCTION FOR THIS SECTION</strong></center></p>" +
        "<p class='instructions'>You have to:</p>" +
         "<ul class='instructions'>" +
          "<li><strong>Approach (move forward) " + stim_to_approach_1 + " by pressing the Y key</strong></li>" +
          "<li><strong>Avoid (move backward) " + stim_to_avoid_1 + " by pressing the N key</strong></li>" +
         "</ul>" +
        "<p class='instructions'>You will start with a training phase.</p>" +
        "<p class='instructions'><u>WARNING:</u> we will report your errors ONLY during the training phase, so " +
        "it is important that you read and memorize the instructions above.</p>" +
        "<p class='continue-instructions'>Press <strong>space</strong> to continue.</p>",
      choices: [32]
  };

  var vaast_instructions_test_block_1 = {
      type: "html-keyboard-response",
      stimulus:
        "<p class='instructions'>The training phase is now over.</p>" +
        "<p class='instructions'><u>WARNING:</u> you will no longer have a message to report your errors.</p>" +
        "<p class='instructions'>As a reminder, you have to :</p>" +
         "<ul class='instructions'>" +
          "<li><strong>Approach (move forward) " + stim_to_approach_1 + " by pressing the Y key</strong></li>" +
          "<li><strong>Avoid (move backward) " + stim_to_avoid_1 + " by pressing the N key</strong></li>" +
         "</ul>" +
        "<p class='continue-instructions'>Press <strong>space</strong> to continue.</p>",
    choices: [32]
  };

  var vaast_instructions_training_block_2 = {
    type : "html-keyboard-response",
    stimulus:
      "<p class='instructions'><center><strong>INSTRUCTION FOR THIS SECTION</strong></center></p>" +
      "<p class='instructions'>You have to:</p>" +
       "<ul class='instructions'>" +
        "<li><strong>Approach (move forward) " + stim_to_approach_2 + " by pressing the Y key</strong></li>" +
        "<li><strong>Avoid (move backward) " + stim_to_avoid_2 + " by pressing the N key</strong></li>" +
       "</ul>" +
      "<p class='instructions'>You will start with a training phase.</p>" +
      "<p class='instructions'><u>WARNING:</u> we will report your errors ONLY during the training phase, so " +
      "it is important that you read and memorize the instructions above.</p>" +
      "<p class='continue-instructions'>Press <strong>space</strong> to continue.</p>",
    choices: [32]
  };

  var vaast_instructions_test_block_2 = {
      type: "html-keyboard-response",
      stimulus:
        "<p class='instructions'>The training phase is now over.</p>" +
        "<p class='instructions'><u>WARNING:</u> you will no longer have a message to report your errors.</p>" +
        "<p class='instructions'>As a reminder, you have to :</p>" +
         "<ul class='instructions'>" +
          "<li><strong>Approach (move forward) " + stim_to_approach_2 + " by pressing the Y key</strong></li>" +
          "<li><strong>Avoid (move backward) " + stim_to_avoid_2 + " by pressing the N key</strong></li>" +
         "</ul>" +
        "<p class='continue-instructions'>Press <strong>space</strong> to continue.</p>",
    choices: [32]
  };

  var vaast_instructions_training_block_3 = {
    type : "html-keyboard-response",
    stimulus:
      "<p class='instructions'><center><strong>INSTRUCTION FOR THIS SECTION</strong></center></p>" +
      "<p class='instructions'>You have to:</p>" +
       "<ul class='instructions'>" +
        "<li><strong>Approach (move forward) " + stim_to_approach_3 + " by pressing the Y key</strong></li>" +
        "<li><strong>Avoid (move backward) " + stim_to_avoid_3 + " by pressing the N key</strong></li>" +
       "</ul>" +
      "<p class='instructions'>You will start with a training phase.</p>" +
      "<p class='instructions'><u>WARNING:</u> we will report your errors ONLY during the training phase, so " +
      "it is important that you read and memorize the instructions above.</p>" +
      "<p class='continue-instructions'>Press <strong>space</strong> to continue.</p>",
    choices: [32]
  };

  var vaast_instructions_test_block_3 = {
    type: "html-keyboard-response",
    stimulus:
      "<p class='instructions'>The training phase is now over.</p>" +
      "<p class='instructions'><u>WARNING:</u> you will no longer have a message to report your errors.</p>" +
      "<p class='instructions'>As a reminder, you have to :</p>" +
       "<ul class='instructions'>" +
        "<li><strong>Approach (move forward) " + stim_to_approach_3 + " by pressing the Y key</strong></li>" +
        "<li><strong>Avoid (move backward) " + stim_to_avoid_3 + " by pressing the N key</strong></li>" +
       "</ul>" +
      "<p class='continue-instructions'>Press <strong>space</strong> to continue.</p>",
  choices: [32]
  };

  var vaast_instructions_training_block_4 = {
    type : "html-keyboard-response",
    stimulus:
      "<p class='instructions'><center><strong>INSTRUCTION FOR THIS SECTION</strong></center></p>" +
      "<p class='instructions'>You have to:</p>" +
       "<ul class='instructions'>" +
        "<li><strong>Approach (move forward) " + stim_to_approach_4 + " by pressing the Y key</strong></li>" +
        "<li><strong>Avoid (move backward) " + stim_to_avoid_4 + " by pressing the N key</strong></li>" +
       "</ul>" +
      "<p class='instructions'>You will start with a training phase.</p>" +
      "<p class='instructions'><u>WARNING:</u> we will report your errors ONLY during the training phase, so " +
      "it is important that you read and memorize the instructions above.</p>" +
      "<p class='continue-instructions'>Press <strong>space</strong> to continue.</p>",
    choices: [32]
  };

  var vaast_instructions_test_block_4 = {
    type: "html-keyboard-response",
    stimulus:
      "<p class='instructions'>The training phase is now over.</p>" +
      "<p class='instructions'><u>WARNING:</u> you will no longer have a message to report your errors.</p>" +
      "<p class='instructions'>As a reminder, you have to :</p>" +
       "<ul class='instructions'>" +
        "<li><strong>Approach (move forward) " + stim_to_approach_4 + " by pressing the Y key</strong></li>" +
        "<li><strong>Avoid (move backward) " + stim_to_avoid_4 + " by pressing the N key</strong></li>" +
       "</ul>" +
      "<p class='continue-instructions'>Press <strong>space</strong> to continue.</p>",
  choices: [32]
  };

  var vaast_instructions_4 = {
    type: "html-keyboard-response",
    stimulus:
      "<p class='instructions'><center>Before you start:</center></p>" +
      "<p class='instructions'>Remember that it is EXTREMELY IMPORTANT that you try to " +
      "respond as fast and as correctly as possible.</p>" +
      "<br>" +
      "<p class='continue-instructions'>Press <strong>space</strong> to continue.</p>",
    choices: [32]
  }

  var vaast_instructions_5 = {
    type: "html-keyboard-response",
    stimulus:
      "<p class='instructions'><center><strong>End of this section</strong></center></p>" +
      "<br>" +
      "<p class = 'continue-instructions'><center>Press <strong>space</strong> to continue.</center></p>",
    choices: [32]
  };


  // Creating a trial ---------------------------------------------------------------------

  var vaast_start = {
    type: 'vaast-text',
    stimulus: "o",
    position: 2,
    background_images: background,
    font_sizes:  word_sizes,
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
    font_size: 46,
    position: 2,
    background_images: background
  }

  var vaast_first_step_train_1 = {
    type: (vaast_cond_block_1 == "approach_images_pos" || vaast_cond_block_1 == "approach_images_neg") ? 'vaast-image' : 'vaast-text',
    stimulus: jsPsych.timelineVariable('stimulus'),
    position: 2,
    background_images: background,
    font_sizes: (vaast_cond_block_1 == "approach_images_pos" || vaast_cond_block_1 == "approach_images_neg") ? image_sizes : word_sizes,
    stim_movement: jsPsych.timelineVariable('movement'),
    approach_key:  approach_key,
    avoidance_key: avoidance_key,
    html_when_wrong: '<span style="color: red; font-size: 80px">&times;</span>',
    force_correct_key_press: false,
    display_feedback: true,
    feedback_duration: 500, 
    response_ends_trial: true
  }

  var vaast_first_step_1 = {
    type: (vaast_cond_block_1 == "approach_images_pos" || vaast_cond_block_1 == "approach_images_neg") ? 'vaast-image' : 'vaast-text',
    stimulus: jsPsych.timelineVariable('stimulus'),
    position: 2,
    background_images: background,
    font_sizes: (vaast_cond_block_1 == "approach_images_pos" || vaast_cond_block_1 == "approach_images_neg") ? image_sizes : word_sizes,
    stim_movement: jsPsych.timelineVariable('movement'),
    approach_key:  approach_key,
    avoidance_key: avoidance_key,
    html_when_wrong: '<span style="color: red; font-size: 80px">&times;</span>',
    force_correct_key_press: false,
    display_feedback: false,
    response_ends_trial: true
  }

  var vaast_second_step_1 = {
    type: (vaast_cond_block_1 == "approach_images_pos" || vaast_cond_block_1 == "approach_images_neg") ? 'vaast-image' : 'vaast-text',
    position: next_position,
    stimulus: jsPsych.timelineVariable('stimulus'),
    background_images: background,
    font_sizes: (vaast_cond_block_1 == "approach_images_pos" || vaast_cond_block_1 == "approach_images_neg") ? image_sizes : word_sizes,
    stim_movement: jsPsych.timelineVariable('movement'),
    response_ends_trial: false,
    trial_duration: 500
  }

  var vaast_second_train_1 = {
    chunk_type: "if",
    timeline: [vaast_second_step_1],
    conditional_function: function(){
      var data = jsPsych.data.getLastTrialData().values()[0];
      return data.correct;
    }
  }

  var vaast_first_step_train_2 = {
    type: (vaast_cond_block_2 == "approach_images_pos" || vaast_cond_block_2 == "approach_images_neg") ? 'vaast-image' : 'vaast-text',
    stimulus: jsPsych.timelineVariable('stimulus'),
    position: 2,
    background_images: background,
    font_sizes: (vaast_cond_block_2 == "approach_images_pos" || vaast_cond_block_2 == "approach_images_neg") ? image_sizes : word_sizes,
    stim_movement: jsPsych.timelineVariable('movement'),
    approach_key:  approach_key,
    avoidance_key: avoidance_key,
    html_when_wrong: '<span style="color: red; font-size: 80px">&times;</span>',
    force_correct_key_press: false,
    display_feedback: true,
    feedback_duration: 500, 
    response_ends_trial: true
  }

  var vaast_first_step_2 = {
    type: (vaast_cond_block_2 == "approach_images_pos" || vaast_cond_block_2 == "approach_images_neg") ? 'vaast-image' : 'vaast-text',
    stimulus: jsPsych.timelineVariable('stimulus'),
    position: 2,
    background_images: background,
    font_sizes: (vaast_cond_block_2 == "approach_images_pos" || vaast_cond_block_2 == "approach_images_neg") ? image_sizes : word_sizes,
    stim_movement: jsPsych.timelineVariable('movement'),
    approach_key:  approach_key,
    avoidance_key: avoidance_key,
    html_when_wrong: '<span style="color: red; font-size: 80px">&times;</span>',
    force_correct_key_press: false,
    display_feedback: false,
    response_ends_trial: true
  }

  var vaast_second_step_2 = {
    type: (vaast_cond_block_2 == "approach_images_pos" || vaast_cond_block_2 == "approach_images_neg") ? 'vaast-image' : 'vaast-text',
    position: next_position,
    stimulus: jsPsych.timelineVariable('stimulus'),
    background_images: background,
    font_sizes: (vaast_cond_block_2 == "approach_images_pos" || vaast_cond_block_2 == "approach_images_neg") ? image_sizes : word_sizes,
    stim_movement: jsPsych.timelineVariable('movement'),
    response_ends_trial: false,
    trial_duration: 500
  }

  var vaast_second_train_2 = {
    chunk_type: "if",
    timeline: [vaast_second_step_2],
    conditional_function: function(){
      var data = jsPsych.data.getLastTrialData().values()[0];
      return data.correct;
    }
  }

  var vaast_first_step_train_3 = {
    type: (vaast_cond_block_3 == "approach_images_pos" || vaast_cond_block_3 == "approach_images_neg") ? 'vaast-image' : 'vaast-text',
    stimulus: jsPsych.timelineVariable('stimulus'),
    position: 2,
    background_images: background,
    font_sizes: (vaast_cond_block_3 == "approach_images_pos" || vaast_cond_block_3 == "approach_images_neg") ? image_sizes : word_sizes,
    stim_movement: jsPsych.timelineVariable('movement'),
    approach_key:  approach_key,
    avoidance_key: avoidance_key,
    html_when_wrong: '<span style="color: red; font-size: 80px">&times;</span>',
    force_correct_key_press: false,
    display_feedback: true,
    feedback_duration: 500, 
    response_ends_trial: true
  }

  var vaast_first_step_3 = {
    type: (vaast_cond_block_3 == "approach_images_pos" || vaast_cond_block_3 == "approach_images_neg") ? 'vaast-image' : 'vaast-text',
    stimulus: jsPsych.timelineVariable('stimulus'),
    position: 2,
    background_images: background,
    font_sizes: (vaast_cond_block_3 == "approach_images_pos" || vaast_cond_block_3 == "approach_images_neg") ? image_sizes : word_sizes,
    stim_movement: jsPsych.timelineVariable('movement'),
    approach_key:  approach_key,
    avoidance_key: avoidance_key,
    html_when_wrong: '<span style="color: red; font-size: 80px">&times;</span>',
    force_correct_key_press: false,
    display_feedback: false,
    response_ends_trial: true
  }

  var vaast_second_step_3 = {
    type: (vaast_cond_block_3 == "approach_images_pos" || vaast_cond_block_3 == "approach_images_neg") ? 'vaast-image' : 'vaast-text',
    position: next_position,
    stimulus: jsPsych.timelineVariable('stimulus'),
    background_images: background,
    font_sizes: (vaast_cond_block_3 == "approach_images_pos" || vaast_cond_block_3 == "approach_images_neg") ? image_sizes : word_sizes,
    stim_movement: jsPsych.timelineVariable('movement'),
    response_ends_trial: false,
    trial_duration: 500
  }

  var vaast_second_train_3 = {
    chunk_type: "if",
    timeline: [vaast_second_step_3],
    conditional_function: function(){
      var data = jsPsych.data.getLastTrialData().values()[0];
      return data.correct;
    }
  }

  var vaast_first_step_train_4 = {
    type: (vaast_cond_block_4 == "approach_images_pos" || vaast_cond_block_4 == "approach_images_neg") ? 'vaast-image' : 'vaast-text',
    stimulus: jsPsych.timelineVariable('stimulus'),
    position: 2,
    background_images: background,
    font_sizes: (vaast_cond_block_4 == "approach_images_pos" || vaast_cond_block_4 == "approach_images_neg") ? image_sizes : word_sizes,
    stim_movement: jsPsych.timelineVariable('movement'),
    approach_key:  approach_key,
    avoidance_key: avoidance_key,
    html_when_wrong: '<span style="color: red; font-size: 80px">&times;</span>',
    force_correct_key_press: false,
    display_feedback: true,
    feedback_duration: 500, 
    response_ends_trial: true
  }

  var vaast_first_step_4 = {
    type: (vaast_cond_block_4 == "approach_images_pos" || vaast_cond_block_4 == "approach_images_neg") ? 'vaast-image' : 'vaast-text',
    stimulus: jsPsych.timelineVariable('stimulus'),
    position: 2,
    background_images: background,
    font_sizes: (vaast_cond_block_4 == "approach_images_pos" || vaast_cond_block_4 == "approach_images_neg") ? image_sizes : word_sizes,
    stim_movement: jsPsych.timelineVariable('movement'),
    approach_key:  approach_key,
    avoidance_key: avoidance_key,
    html_when_wrong: '<span style="color: red; font-size: 80px">&times;</span>',
    force_correct_key_press: false,
    display_feedback: false,
    response_ends_trial: true
  }

  var vaast_second_step_4 = {
    type: (vaast_cond_block_4 == "approach_images_pos" || vaast_cond_block_4 == "approach_images_neg") ? 'vaast-image' : 'vaast-text',
    position: next_position,
    stimulus: jsPsych.timelineVariable('stimulus'),
    background_images: background,
    font_sizes: (vaast_cond_block_4 == "approach_images_pos" || vaast_cond_block_4 == "approach_images_neg") ? image_sizes : word_sizes,
    stim_movement: jsPsych.timelineVariable('movement'),
    response_ends_trial: false,
    trial_duration: 500
  }

  var vaast_second_train_4 = {
    chunk_type: "if",
    timeline: [vaast_second_step_4],
    conditional_function: function(){
      var data = jsPsych.data.getLastTrialData().values()[0];
      return data.correct;
    }
  }

  // VAAST blocks ---------------------------------------------------------------------

  var vaast_training_block_1 = {
    timeline: [vaast_start, vaast_fixation, vaast_first_step_train_1, vaast_second_train_1, save_vaast_trial],
    timeline_variables: (vaast_cond_block_1 == "approach_images_pos" || vaast_cond_block_1 == "approach_images_neg") ? vaast_stim_training_block_1_images : vaast_stim_training_block_1_words,
    repetitions: 1,
    randomize_order: true
  };

  var vaast_test_block_1 = {
    timeline: [vaast_start, vaast_fixation, vaast_first_step_1, vaast_second_step_1, save_vaast_trial],
    timeline_variables: (vaast_cond_block_1 == "approach_images_pos" || vaast_cond_block_1 == "approach_images_neg") ? vaast_stim_block_1_images : vaast_stim_block_1_words,
    repetitions: 1,
    randomize_order: true
  };
  
  var vaast_training_block_2 = {
    timeline: [vaast_start, vaast_fixation, vaast_first_step_train_2, vaast_second_train_2, save_vaast_trial],
    timeline_variables: (vaast_cond_block_2 == "approach_images_pos" || vaast_cond_block_2 == "approach_images_neg") ? vaast_stim_training_block_2_images : vaast_stim_training_block_2_words,
    repetitions: 1,
    randomize_order: true
  };

  var vaast_test_block_2 = {
    timeline: [vaast_start, vaast_fixation, vaast_first_step_2, vaast_second_step_2, save_vaast_trial],
    timeline_variables: (vaast_cond_block_2 == "approach_images_pos" || vaast_cond_block_2 == "approach_images_neg") ? vaast_stim_block_2_images : vaast_stim_block_2_words,
    repetitions: 1,
    randomize_order: true
  };

  var vaast_training_block_3 = {
    timeline: [vaast_start, vaast_fixation, vaast_first_step_train_3, vaast_second_train_3, save_vaast_trial],
    timeline_variables: (vaast_cond_block_3 == "approach_images_pos" || vaast_cond_block_3 == "approach_images_neg") ? vaast_stim_training_block_3_images : vaast_stim_training_block_3_words,
    repetitions: 1,
    randomize_order: true
  };

  var vaast_test_block_3 = {
    timeline: [vaast_start, vaast_fixation, vaast_first_step_3, vaast_second_step_3, save_vaast_trial],
    timeline_variables: (vaast_cond_block_3 == "approach_images_pos" || vaast_cond_block_3 == "approach_images_neg") ? vaast_stim_block_3_images : vaast_stim_block_3_words,
    repetitions: 1,
    randomize_order: true
  };

  var vaast_training_block_4 = {
    timeline: [vaast_start, vaast_fixation, vaast_first_step_train_4, vaast_second_train_4, save_vaast_trial],
    timeline_variables: (vaast_cond_block_4 == "approach_images_pos" || vaast_cond_block_4 == "approach_images_neg") ? vaast_stim_training_block_4_images : vaast_stim_training_block_4_words,
    repetitions: 1,
    randomize_order: true
  };

  var vaast_test_block_4 = {
    timeline: [vaast_start, vaast_fixation, vaast_first_step_4, vaast_second_step_4, save_vaast_trial],
    timeline_variables: (vaast_cond_block_4 == "approach_images_pos" || vaast_cond_block_4 == "approach_images_neg") ? vaast_stim_block_4_images : vaast_stim_block_4_words,
    repetitions: 1,
    randomize_order: true
  };

  
  // end fullscreen -----------------------------------------------------------------------

  var fullscreen_trial_exit = {
    type: 'fullscreen',
    fullscreen_mode: false
  }

  // demographics + questions -------------------------------------------------------------

  var extra_information = {
    type: 'html-keyboard-response',
    stimulus:
      "<p class='instructions'>You are close to completing this study. You will just have to answer to a few questions.</p>" +
      "<p class='continue-instructions'>Press <strong>space</strong> to continue.</p>",
    choices: [32]
  };

  var extra_information_1 = {
    type: 'survey-multi-choice',
    questions: [
      {prompt: "Have you ever completed the previous task in the past?",
       options: ["Yes", "No", "I cannot remember"], required: true, horizontal: true}
      ],
    button_label: "Submit"
  };

  var extra_information_2 = {
    timeline: [{
      type: 'survey-text',
      questions: [{prompt: "What is your age?"}],
      button_label: "Submit",
    }],
    loop_function: function(data) {
      var extra_information_2 = data.values()[0].responses;
      var extra_information_2 = JSON.parse(extra_information_2).Q0;
      if (extra_information_2 == "") {
        alert("Please enter you age!");
        return true;
      }
    },
    on_finish: function(data) {
      jsPsych.data.addProperties({
        extra_information_2: JSON.parse(data.responses)["Q0"],
      });
    }
  }

  var extra_information_3 = {
    type: 'survey-multi-choice',
    questions: [{prompt: "What is your sex?", options: ["Male", "Female", "Other"], required: true, horizontal: true}],
    button_label: "Submit"
  }

  var extra_information_4 = {
    type: 'survey-multi-choice',
    questions: [{prompt: "How well do you speak english?",
                 options: ["Fluently", "Very good", "Good", "Average", "Bad", "Very bad"],
                 required: true, horizontal: false}],
    button_label: "Submit"
  }

  var extra_information_5 = {
    type: 'survey-multi-choice',
    questions: [{prompt: "What is your socioeconomic status?",
                 options: ["Very low", "Low", "Medium", "High", "Very high"],
                 required: true, horizontal: false}],
    button_label: "Submit"
  }

  var extra_information_6 = {
    type: 'survey-multi-choice',
    questions: [{prompt: "What is your highest level of education?",
                 options: ["Did not complete high school", "High school/GED", "Some college", "Bachelor's degree", "Master's degree", "Advanced graduate work or Ph.D."],
                 required: true, horizontal: false}],
    button_label: "Submit"
  }

  var extra_information_7 = {
    type: 'survey-text',
    questions: [{prompt: "Do you have any remarks about this study? [Optional]"}],
    button_label: "Submit"
  }

  // end insctruction ---------------------------------------------------------------------

  var ending = {
    type: "html-keyboard-response",
    stimulus:
      "<p class='instructions'>You are now finished with this study.<p>" +
      "<p class='instructions'>In this study, we were interested in the effect of " +
      "approach and avoidance training. Research show that this kind of " +
      "training can be used to create new attitudes toward a specific object. Approaching " +
      "something make us see it more positively. </p>" +
      "<p class='instructions'> Here, we wanted to see if it could also be used to create " +
      "an association between the self and new objects using an approach training. </p>" +
      "<p class='instructions'>For more information to this topic, please email " +
      "cedric.batailler@univ-grenoble-alpes.fr</p>" +
      "<p class = 'continue-instructions'>Press <strong>space</strong> to continue.</p>",
    choices: [32]
  };

  var ending_2 = {
    type: "html-keyboard-response",
    trial_duration: 2000,
    stimulus:
      "<p class='instructions'>You will now be redirected to Prolific Academic's website " +
      "within seconds.<p>" +
      "<p class='instructions'>If you are not redirected, please click <a href='https://app.prolific.ac/submissions/complete?cc=OM0MJFFH'>here</a>.<p>",
    choices: jsPsych.NO_KEYS
  };
  // procedure ----------------------------------------------------------------------------
  // Initialize timeline ------------------------------------------------------------------
  var timeline = [];

  welcome
  timeline.push(welcome,
                consent,
                welcome_2,
                if_not_enough_time);

  // prolific verification
  timeline.push(save_id);

  // fullscreen
  timeline.push(fullscreen_trial,
                hiding_cursor);

  // initial instructions
  timeline.push(instructions);

  // vaast - instructions
  timeline.push(vaast_instructions_1,
                vaast_instructions_2,
                vaast_instructions_3);

 // vaast - blocks
  timeline.push(vaast_instructions_training_block_1,
                vaast_instructions_4,
                vaast_training_block_1,
                vaast_instructions_test_block_1,
                vaast_test_block_1,
                vaast_instructions_5,
                vaast_instructions_training_block_2,
                vaast_instructions_4,
                vaast_training_block_2,
                vaast_instructions_test_block_2,
                vaast_test_block_2,
                vaast_instructions_5,
                vaast_instructions_training_block_3,
                vaast_instructions_4,
                vaast_training_block_3,
                vaast_instructions_test_block_3,
                vaast_test_block_3,
                vaast_instructions_5,
                vaast_instructions_training_block_4,
                vaast_instructions_4,
                vaast_training_block_4,
                vaast_instructions_test_block_4,
                vaast_test_block_4,
                vaast_instructions_5);

  // vaast - end
  timeline.push(fullscreen_trial_exit,
                showing_cursor);

 // demographic questions
  timeline.push(extra_information,
                extra_information_1,
                extra_information_2,
                extra_information_3,
                extra_information_4,
                extra_information_5,
                extra_information_6,
                extra_information_7,
                save_extra);

  // ending
  timeline.push(ending,
                ending_2);

  // Launch experiment --------------------------------------------------------------------
  // preloading ---------------------------------------------------------------------------
  // Preloading. For some reason, it appears auto-preloading fails, so using it manually.
  // In principle, it should have ended when participants starts VAAST procedure (which)
  // contains most of the image that have to be pre-loaded.
  var loading_gif               = ["media/loading.gif"]
  var vaast_instructions_images = ["media/vaast-background.png", "media/keyboard-vaastt.png"];
  var vaast_bg_filename         = background;
  var vaast_stimuli_images      = ["stimuli/apple_2.jpg",      "stimuli/beach_3.jpg",     "stimuli/bed_1.jpg",
                                   "stimuli/cake_1.jpg",       "stimuli/chocolate_2.jpg", "stimuli/acne_2.jpg",
                                   "stimuli/blood_1.jpg",      "stimuli/cockroach_3.jpg", "stimuli/coffin_2.jpg",
                                   "stimuli/corpse_3.jpg",     "stimuli/christmas_3.jpg", "stimuli/cookies_2.jpg",
                                   "stimuli/cupcake_3.jpg",    "stimuli/deer_2.jpg",      "stimuli/fireworks_2.jpg",
                                   "stimuli/flower_1.jpg",     "stimuli/marriage_2.jpg",  "stimuli/meditation_1.jpg",
                                   "stimuli/mountain_1.jpg",   "stimuli/pie_3.jpg",       "stimuli/pizza_4.jpg",
                                   "stimuli/prairie_1.jpg",    "stimuli/puppy_4.jpg",     "stimuli/rabbit_2.jpg",
                                   "stimuli/rainbow_1.jpg",    "stimuli/raspberry_1.jpg", "stimuli/spaghetti_2.jpg",
                                   "stimuli/strawberry_1.jpg", "stimuli/sunset_3.jpg",    "stimuli/waterfall_1.jpg",
                                   "stimuli/devil_1.jpg",      "stimuli/explosion_1.jpg", "stimuli/feces_2.jpg",
                                   "stimuli/flood_1.jpg",      "stimuli/gun_1.jpg",       "stimuli/homeless_2.jpg",
                                   "stimuli/hurricane_2.jpg",  "stimuli/jail_1.jpg",      "stimuli/knife_1.jpg",
                                   "stimuli/mutilation_1.jpg", "stimuli/pollution_1.jpg", "stimuli/rat_3.jpg",
                                   "stimuli/rifle_3.jpg",      "stimuli/shark_2.jpg",     "stimuli/sick_2.jpg",
                                   "stimuli/snake_3.jpg",      "stimuli/spider_3.jpg",    "stimuli/suicide_1.jpg",
                                   "stimuli/war_2.jpg",        "stimuli/worm_2.jpg",
                                  ];

  jsPsych.pluginAPI.preloadImages(loading_gif);
  jsPsych.pluginAPI.preloadImages(vaast_instructions_images);
  jsPsych.pluginAPI.preloadImages(vaast_bg_filename);
  jsPsych.pluginAPI.preloadImages(vaast_stimuli_images)
  // timeline initiaization ---------------------------------------------------------------

  if(is_compatible) {
    jsPsych.init({
        timeline: timeline,
        on_interaction_data_update: function() {
          saving_browser_events(completion = false);
        },
      on_finish: function() {
          saving_browser_events(completion = true);
          window.location.href = "https://app.prolific.ac/submissions/complete?cc=OM0MJFFH";
      }
    });
  }
