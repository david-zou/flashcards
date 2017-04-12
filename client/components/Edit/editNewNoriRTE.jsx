import React, {Component, PropTypes} from 'react';
import RichTextEditor from 'react-rte';
import {convertFromRaw, EditorState, convertToRaw} from 'draft-js'
//------redux dependencies
import {connect} from 'react-redux'
import * as actions from '../../actions/editPageActions.js'



class editNewNoriRTE extends Component {
constructor(props){
  super(props)    
  this.state = {
    value: RichTextEditor.createEmptyValue(),
    rawValue : null,
    showTB : true
  }
  this.convertFromRawJs = this.convertFromRawJs.bind(this)
  this.onChange = this.onChange.bind(this)
  this.handleNoriChange = this.props.handleNoriChange
}

  componentWillReceiveProps (newProps) {
    var text = newProps.bento.noris[this.props.number][this.props.side]['text'] 
    // var rawValue = newProps.bento.noris[this.props.number][this.props.side]['rawValue']
    console.log(text,"----", this.state.rawValue, "-----", this.props)
    if(text != this.state.rawValue){
      var rawJs = text;
      var newValue = this.convertFromRawJs(rawJs)
      this.setState({value: newValue})
    }
  }

  componentDidMount() {
      var newValue = this.convertFromRawJs(this.props.bento.noris[this.props.number][this.props.side]['text'])
      this.setState({value: newValue})
  }

  convertFromRawJs (rawJs) {
    if(rawJs){
      var content = convertFromRaw(JSON.parse(rawJs))
      var newValue = RichTextEditor.createEmptyValue()
      newValue._editorState = EditorState.createWithContent(content)
      return newValue
    }
    return RichTextEditor.createEmptyValue()
  }

  onChange (value) {
    var rawValue = JSON.stringify(convertToRaw(value._editorState.getCurrentContent()))
    this.setState({value, rawValue: rawValue}, () => {
    this.props.handleNoriChange(this.props.bento.noris, rawValue, this.props.side, this.props.number)}
    )
  }


  render () {
    console.log("This props of line 57", this.props )
    const ToolbarConfig = {
    // Optionally specify the groups to display (displayed in the order listed).
    display: ['INLINE_STYLE_BUTTONS', 'BLOCK_TYPE_BUTTONS', 'LINK_BUTTONS', 'BLOCK_TYPE_DROPDOWN', 'HISTORY_BUTTONS'],
    INLINE_STYLE_BUTTONS: [
      {label: 'Bold', style: 'BOLD', className: 'custom-css-class'},
      {label: 'Italic', style: 'ITALIC'},
      {label: 'Underline', style: 'UNDERLINE'}
    ],
    BLOCK_TYPE_DROPDOWN: [
      {label: 'Normal', style: 'unstyled'},
      {label: 'Heading Large', style: 'header-one'},
      {label: 'Heading Medium', style: 'header-two'},
      {label: 'Heading Small', style: 'header-three'}
    ],
    BLOCK_TYPE_BUTTONS: [
      {label: 'UL', style: 'unordered-list-item'},
      {label: 'OL', style: 'ordered-list-item'}
    ]
  };

  const hiddenToolbarConfig = {
    display: ['NONE']
  }

    var config = this.state.showTB ? ToolbarConfig : hiddenToolbarConfig
    return (
      <RichTextEditor
        toolbarConfig = {config}
        value={this.state.value}
        onFocus = {this.onFocus}
        onBlur = {this.onBlur}
        onChange={this.onChange}
        placeholder = {this.props.side} 
      />
    );
  }
}
function mapStateToProps (state) {
  return {
    bento: state.editBentoInfo,
  }
}
export default connect(mapStateToProps, actions)(editNewNoriRTE)




  // this.onFocus = this.onFocus.bind(this)
  // this.onBlur = this.onBlur.bind(this)
  // onFocus (){
  //   this.setState({
  //     showTB : true
  //   })
  // }
  // onBlur () {
  //   this.setState({
  //     showTB: true
  //   })
  // }