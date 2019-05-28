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
    group_to_approach_1 = "bleu";
    group_to_avoid_1    = "jaune";
    movement_blue_2    = "avoidance";
    movement_yellow_2    = "approach";
    group_to_approach_2 = "jaune";
    group_to_avoid_2    = "bleu";
    break;

  case "approach_yellow":
    movement_blue_1    = "avoidance";
    movement_yellow_1    = "approach";
    group_to_approach_1 = "jaune";
    group_to_avoid_1    = "bleu";
    movement_blue_2    = "approach";
    movement_yellow_2    = "avoidance";
    group_to_approach_2 = "bleu";
    group_to_avoid_2    = "jaune";
    break;
}

// VAAST stimuli ------------------------------------------------------------------------
// vaast image stimuli ------------------------------------------------------------------
// Ici, on ajoute un nouveau mouvement, en fonction du bloc de la vaast on appellera soit
// movement_1 ou movement_2.

var vaast_stim_training_G1Y = [
  {movement_1: movement_blue_1, movement_2: movement_blue_2, group: "bleu", stimulus: 'stimuli/Face19_B.png'},
  {movement_1: movement_blue_1, movement_2: movement_blue_2, group: "bleu", stimulus: 'stimuli/Face28_B.png'},
  {movement_1: movement_blue_1, movement_2: movement_blue_2, group: "bleu", stimulus: 'stimuli/Face55_B.png'},
  {movement_1: movement_blue_1, movement_2: movement_blue_2, group: "bleu", stimulus: 'stimuli/Face95_B.png'},
  {movement_1: movement_blue_1, movement_2: movement_blue_2, group: "bleu", stimulus: 'stimuli/Face104_B.png'},
  {movement_1: movement_blue_1, movement_2: movement_blue_2, group: "bleu", stimulus: 'stimuli/Face115_B.png'},
  {movement_1: movement_blue_1, movement_2: movement_blue_2, group: "bleu", stimulus: 'stimuli/Face119_B.png'},
  {movement_1: movement_blue_1, movement_2: movement_blue_2, group: "bleu", stimulus: 'stimuli/Face142_B.png'},
  {movement_1: movement_yellow_1, movement_2: movement_yellow_2,  group: "jaune",  stimulus: 'stimuli/Face10_J.png'},
  {movement_1: movement_yellow_1, movement_2: movement_yellow_2,  group: "jaune",  stimulus: 'stimuli/Face16_J.png'},
  {movement_1: movement_yellow_1, movement_2: movement_yellow_2,  group: "jaune",  stimulus: 'stimuli/Face17_J.png'},
  {movement_1: movement_yellow_1, movement_2: movement_yellow_2,  group: "jaune",  stimulus: 'stimuli/Face45_J.png'},
  {movement_1: movement_yellow_1, movement_2: movement_yellow_2,  group: "jaune",  stimulus: 'stimuli/Face85_J.png'},
  {movement_1: movement_yellow_1, movement_2: movement_yellow_2,  group: "jaune",  stimulus: 'stimuli/Face103_J.png'},
  {movement_1: movement_yellow_1, movement_2: movement_yellow_2,  group: "jaune",  stimulus: 'stimuli/Face116_J.png'},
  {movement_1: movement_yellow_1, movement_2: movement_yellow_2,  group: "jaune",  stimulus: 'stimuli/Face132_J.png'}
]

var vaast_stim_training_G1B = [
  {movement_1: movement_blue_1, movement_2: movement_blue_2, group: "jaune", stimulus: 'stimuli/Face19_J.png'},
  {movement_1: movement_blue_1, movement_2: movement_blue_2, group: "jaune", stimulus: 'stimuli/Face28_J.png'},
  {movement_1: movement_blue_1, movement_2: movement_blue_2, group: "jaune", stimulus: 'stimuli/Face55_J.png'},
  {movement_1: movement_blue_1, movement_2: movement_blue_2, group: "jaune", stimulus: 'stimuli/Face95_J.png'},
  {movement_1: movement_blue_1, movement_2: movement_blue_2, group: "jaune", stimulus: 'stimuli/Face104_J.png'},
  {movement_1: movement_blue_1, movement_2: movement_blue_2, group: "jaune", stimulus: 'stimuli/Face115_J.png'},
  {movement_1: movement_blue_1, movement_2: movement_blue_2, group: "jaune", stimulus: 'stimuli/Face119_J.png'},
  {movement_1: movement_blue_1, movement_2: movement_blue_2, group: "jaune", stimulus: 'stimuli/Face142_J.png'},
  {movement_1: movement_yellow_1, movement_2: movement_yellow_2,  group: "bleu",  stimulus: 'stimuli/Face10_B.png'},
  {movement_1: movement_yellow_1, movement_2: movement_yellow_2,  group: "bleu",  stimulus: 'stimuli/Face16_B.png'},
  {movement_1: movement_yellow_1, movement_2: movement_yellow_2,  group: "bleu",  stimulus: 'stimuli/Face17_B.png'},
  {movement_1: movement_yellow_1, movement_2: movement_yellow_2,  group: "bleu",  stimulus: 'stimuli/Face45_B.png'},
  {movement_1: movement_yellow_1, movement_2: movement_yellow_2,  group: "bleu",  stimulus: 'stimuli/Face85_B.png'},
  {movement_1: movement_yellow_1, movement_2: movement_yellow_2,  group: "bleu",  stimulus: 'stimuli/Face103_B.png'},
  {movement_1: movement_yellow_1, movement_2: movement_yellow_2,  group: "bleu",  stimulus: 'stimuli/Face116_B.png'},
  {movement_1: movement_yellow_1, movement_2: movement_yellow_2,  group: "bleu",  stimulus: 'stimuli/Face132_B.png'}
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
    type: "html-button-response",
    stimulus:
      "<h1 class ='custom-title'> Bienvenue </h1>" +
      "<ul class='instructions'>" +
      "Dans cette étude, <b>vous devrez effectuer deux tâches de catégorisation</b>. " +
      "<br>" +
      " Nous vous rappelons que <b>vous avez le droit de vous retirer de l'expérience à tout moment</b>" +
      " sans devoir vous justifier et sans subir aucun préjudice. Dans ce cas," +
      " l'expérimentateur est là pour vous aider à gérer cette situation. Nous vous" +
      " rappelons également que si vous vous retirez de l'étude, vous conserverez le bénéfice" +
      " obtenu des crédits attribués pour cette participation. Par ailleurs, nous garantissons" +
      " également la confidentialité et l'anonymat de vos réponses." +
      "<br>" +
      "<p class='instructions'>Des informations complémentaires peuvent être obtenues à tout" +
      " moment auprès de l'expérimentateur ou de l'expérimentatrice en charge." +
      "<p class='instructions'>En cliquant sur le bouton \"Je confirme\" je donne mon consentement libre et éclairé pour cette recherche. </p>",
    choices: ['Je confirme']
  }


// Switching to fullscreen --------------------------------------------------------------
var fullscreen_trial = {
  type: 'fullscreen',
  message:  'Pour commencer, merci de passer en mode plein écran </br></br>',
  button_label: 'Passer en plein écran',
  fullscreen_mode: true
}


// VAAST --------------------------------------------------------------------------------
var Gene_Instr = {
  type: "html-keyboard-response",
  stimulus:
    "<h1 class ='custom-title'> Expérience sur la catégorisation de visages</h1>" +
    "<br>" +
    "<p class='instructions'>Dans cette expérience, nous nous intéressons à la manière " +
    "dont les individus catégorisent autrui et, plus spécifiquement, leur visage.</p>" +
   "<p class='instructions'> Dans cette expérience, vous devrez effectuer deux tâches" +
    " de catégorisation de visages." +
    " En totalité, l'expérience durera environ 30-40 minutes.</p>" +
    "<br>" +
    "<p class = 'continue-instructions'>Appuyez sur <strong>espace</strong> pour" +
    " continuer.</p>",
  choices: [32]
};


var vaast_instructions_1 = {
  type: "html-keyboard-response",
  stimulus:
    "<h1 class ='custom-title'> Tâche du Jeu Vidéo</h1>" +
    "<p class='instructions'>Dans cette tâche, un peu comme dans un jeu vidéo, " +
    "vous allez être dans l'environnement présenté ci-dessous.</p>" +
    "<img src = 'media/vaast-background.png'>" +
    "<br>" +
    "<br>" +
    "<p class = 'continue-instructions'>Appuyez sur <strong>espace</strong> pour" +
    " continuer.</p>",
  choices: [32]
};

var vaast_instructions_2 = {
  type: "html-keyboard-response",
  stimulus:
    "<h1 class ='custom-title'> Tâche du Jeu Vidéo</h1>" +
    "<p class='instructions'>Une série de visages va vous être présentée dans " +
    "cet environnement et votre tâche sera de les catégoriser le plus rapidement possible.</p>" +
    "<p class='instructions'>Notez que ces visages ont été délibérément rendus flous. " +
    "Voici deux exemples de visages qui vous seront présentés :</p>" +
    "<br>" +
    "<img src = 'stimuli/Face119_B_Example.png'>" +
    "                              " +
    "<img src = 'stimuli/Face95_J_Example.png'>" +
    "<br>" +
    "<br>" +
    "<p class='instructions'>Votre tâche sera de catégoriser ces visages en fonction " +
    "de la couleur de fond de l'image (c'est-à-dire bleu ou jaune). "+
    "Des instructions plus spécifiques vont suivre.</p>" +
    "<br>" +
    "<p class = 'continue-instructions'>Appuyez sur <strong>espace</strong> pour" +
    " continuer.</p>",
  choices: [32]
};


var vaast_instructions_3 = {
  type: "html-keyboard-response",
  stimulus:
    "<h1 class ='custom-title'> Tâche du Jeu Vidéo</h1>" +
    "<p class='instructions'>Au début de chaque essai, vous allez voir apparaître au centre de l'écran le symbole 'O'. " +
    "Ce symbole indique que vous devez appuyer sur la touche DEPART (<b>touche H </b>de votre clavier) pour continuer. </p>" +
    "<p class='instructions'>Vous verrez alors apparaître au centre de l'écran un point de fixation (+) suivi d'un visage. </p>" +
    "<p class='instructions'>Votre tâche consiste à catégoriser le visage en appuyant <b>trois fois</b>, et ce le plus rapidement possible, " +
    "sur la <b>touche Y</b> ou sur la <b>touche N</b> de votre clavier. Au bout de ces trois appuis le visage disparaitra et vous devrez "+
    "appuyer de nouveau sur la touche DEPART (touche H). " +
    "<p class='instructions'>Merci également d'utiliser uniquement l'indexe de votre main dominante pour toutes ces actions. </p>" +
    "<br>" +
    "<p class = 'continue-instructions'>Appuyez sur <strong>espace</strong> pour" +
    " continuer.</p>",
  choices: [32]
};

var vaast_instructions_4 = {
  type: "html-keyboard-response",
  stimulus:
    "<h1 class ='custom-title'> Tâche du Jeu Vidéo</h1>" +
    "<p class='instructions'>Plus précisément, vous allez devoir : " +
    "<ul class='instructions'>" +
    "<li><strong><b>Appuyer sur la touche Y</b> pour les visages ayant un fond " + group_to_approach_1 + "</strong></li>" +
    "<li><strong>Appuyer sur la touche N</b> pour les visages ayant un fond " + group_to_avoid_1 + "</strong></li>" +
    "</ul>" +
    "<p class='instructions'>S'il vous plaît, lisez attentivement et assurez-vous de mémoriser les instructions ci-dessous. </p>" +
    "<p class='instructions'><strong>Aussi, il est EXTREMEMENT IMPORTANT d'essayer de répondre le plus rapidement et le plus exactement possible. </strong></p>" +
    "<p class ='instructions'>Si votre réponse est fausse, vous devrez recommencer l'essai et donner la réponse juste.</p>" +
    "<br>" +
    "<p class = 'continue-instructions'>Appuyez sur <strong>entrée</strong> pour " +
    "commencer la tâche.</p>",
  choices: [13]
};

var vaast_instructions_end = {
  type: "html-keyboard-response",
  stimulus:
    "<h1 class ='custom-title'> La tâche du Jeu Vidéo est terminée.</h1>" +
    "<br>" +
    "<p class = 'continue-instructions'>Appuyez sur <strong>espace</strong> pour" +
    " passer à la deuxième tâche</p>",
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
  timeline_variables: vaast_stim_training_G1Y,
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
  timeline_variables: vaast_stim_training_G1Y,
  repetitions: 1,  //here, put 2
  randomize_order: true,
  data: {
    phase:    "training",
    stimulus: jsPsych.timelineVariable('stimulus'),
    movement: jsPsych.timelineVariable('movement_2'),
    group:    jsPsych.timelineVariable('group'),
  }
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
        fullscreen_trial,
			  hiding_cursor);

// prolific verification
timeline.push(save_id);

timeline.push(Gene_Instr,
                  vaast_instructions_1,
                  vaast_instructions_2,
                  vaast_instructions_3, 
                  vaast_instructions_4,
                 vaast_training_block_1,
                  vaast_instructions_end);

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


