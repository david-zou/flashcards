'use strict';

import util from './util.js';
import request from 'axios';
/*
  AI class responsible with the following functionalities:
  speech to text and speech recognition (via google API)
  text to speech (via responsiveVoice.js)
  and active command listening (via annyang.js)
*/
const AI = class {
  constructor(name, bentoId) {
    this.name = name;
    // this.commands = util.commands;
    // this._initAnnyang(util.commands);
    this._getBento(bentoId)
                    .then( data => this.data = data );
    this.commands = this._getCommands();
    this._initAnnyang(this.commands);
  }

  /*
   Inits annyang voice listener with the commands inside AI class
   @private
   @param {object} key: function names, value: functions to be executed with the names are 
      spoken
  */
  _initAnnyang(commands) {
    console.log(commands)
    if (window.annyang) {
      window.annyang.addCommands(commands);
      window.annyang.start();
      window.annyang.debug(true);
    };
  }

  /*
    Retrieves all the necessary bento & noris in order to have a Voice Review Session
    @private
    @return {Promise:object} bento & corresponding noris and relevant display information wrapped in Promise
  */
  _getBento(bentoId) {
    const URL = '/api/bentos';
    const params = { 
      bentoId
    }
    return request.get(URL, { params })
  }


  /*
    Retrieves all the methods in AI class
    removes all the non voice triggering methods
    @private
    @return {object} used to initialize annyang
  */
  _getCommands() {
    // const commandNames = Object.getOwnPropertyNames( AI.prototype );
    // let commandObj = {};
    // let voiceCommands = this._removePrivateMethods(commandNames);
    // voiceCommands.map(command => commandObj[command] = AI.prototype[command] );
    // return commandObj;

    const commands = {
      'start': () => {
        console.log('start triggered')
        let configs = {}
        this.startSession( configs );
      },
      'hello': function(){
        console.log('hello function called')
        say('hello there, my name is norica, here to help you memorize your ')
      },
      'next': function(){
        console.log('next function called!')
      },
      'go' : function(){
        console.log('go fucntion called')
      },
      'repeat': function(){
        console.log('repeat function called')
      },
      'redo': function(){
        console.log('redo function called')
      },
      'previous': function(){
        console.log('previous function called')
      },
      'retry': function(){
        console.log('retry function called')
      },
      'answer': function(){
        console.log('answer function called')
      },
      'accent': function(){
        //another function alias called
        //say it as if you are *country name
        console.log('accent function called')
      }
    };
    return commands;
  }

  /*
    Helper function to check private methods via the underscore convention
    @private
    @param {string} the command name to be checked
    @return {boolean} true if it contains _
  */
  _isUnderScore(methodName) {
    firstCharIsUnderScore = methodName[0] === '_'
    return firstCharIsUnderScore;
  }

  /*
    Private helper function to filter all private methods
    starting from constructor, and then all 
    @private
    @param {array} all the method names in AI class
    @return {array} all the method in AI class that isn't a private method or constuctor
  */
  _removePrivateMethods(CommandsToRemove) {
    const CONSTRUCTOR = 'constructor';
    let nonePrivateMethods = CommandsToRemove
                        .filter(command => !this._isUnderScore(command))
                        .filter(command => command !== CONSTRUCTOR );
    
    return nonePrivateMethods;
  }

  /*
    Starts the Voice Review Session by initializing all necessary dependencies
    @param {object} any configurations for this session
    @return {AI instance} 
  */
  startSession(config) {
    if( !this.data ) {
      console.error('data is yet to be retrieved')
      return this;
    }
    console.log('we have data: ', this.data)
    return this;
  }

  /*
    Command to voice text to speech using Responsive Voice
    @param {string} the string to transform to speech
    @return {AI instance}
  */
  say(text) {
    console.log('i am speaking: ', text)
    window.responsiveVoice.speak(text, "UK English Female");
    return this;
  }
  // speakable(target){
  //   console.log('target func: ', target)
  // }

  listen() {
    return new Promise( (resolve, reject) => {

    });
  }


  
};

function speakable(target){
  console.log('target: ', target)
}
// var a = new AI('joe')


export default AI;