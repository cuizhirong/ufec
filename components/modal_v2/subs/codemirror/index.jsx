/**
 * 这个组件集成了codemirror
 *
 * 支持的lang为: ['xml', 'htmlmixed', 'css', 'javascript', 'yaml', 'python']
 * 支持的theme为: ['material', 'neat']
 * lineNumbers: 是否显示行号
 */

import React from 'react';
import { Form } from 'antd';

// 就不能考虑一下es module吗？难受
const CodeMirror = require('codemirror');
require('codemirror/addon/edit/matchbrackets');
require('codemirror/mode/xml/xml.js');
require('codemirror/mode/htmlmixed/htmlmixed.js');
require('codemirror/mode/css/css.js');
require('codemirror/mode/javascript/javascript.js');
require('codemirror/mode/yaml/yaml.js');
require('codemirror/mode/python/python.js');

const FormItem = Form.Item;
const LANGUAGES = ['xml', 'htmlmixed', 'css', 'javascript', 'yaml', 'python'];

class CodemirrorModal extends React.Component {
  constructor(props) {
    super(props);

    if (!~LANGUAGES.indexOf(this.props.lang)) {
      throw new Error(`Only support ${LANGUAGES}`);
    }

    this.state = {
      value: this.props.decorator.initialValue || '',
      theme: this.props.theme || 'neat',
      lang: this.props.lang || 'yaml',
      lineNumbers: this.props.lineNumbers || true
    };
  }

  componentDidMount() {
    const state = this.state;
    const editor = CodeMirror(this.ref, {
      value: state.value,
      mode: state.lang,
      theme: state.theme,
      lineNumbers: state.lineNumbers,
      matchBrackets: true
    });
    editor.on('change', (codemirrorIns, codemirrorObj) => {
      this.onChange(editor.getValue());
    });
  }

  onChange = (value) => {
    this.setState({
      value
    }, () => {
      this.props.form.setFieldsValue({
        [this.props.field]: this.state.value
      });
    });
  }

  render() {
    const props = this.props,
      state = this.state;
    let className = 'codemirror-wrapper';

    className += state.hide ? ' hide' : '';

    const formItemLayout = props.formItemLayout || {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 }
    };
    const decorator = props.decorator;
    const { getFieldDecorator } = this.props.form;

    return (<div className={props.className}>
      <FormItem
        label={props.label}
        required={props.required}
        className={className}
        {...formItemLayout}
        validateStatus={state.status}
        help={props.__[state.msg] || state.msg}
      >
        {
          decorator && !state.hide ? getFieldDecorator(decorator.id, {
            rules: decorator.rules,
            initialValue: decorator.initialValue
          })(<div className="code" ref={self => this.ref = self} />) : <div />
        }
      </FormItem>
    </div>);
  }
}

export default CodemirrorModal;
