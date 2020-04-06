var _templateObject = _taggedTemplateLiteral(['\n  background: transparent;\n  font: 400 14px sans-serif;\n  border: none;\n  border-radius: 3px;\n  outline: none;\n  font-size: 16px;\n  display: inline-block;\n  width: 100%;\n  color: #69626D;\n  font-weight: 400;\n  &::-webkit-input-placeholder {\n    font-weight: 100;\n    font-style: italic;\n    color: #69626D;\n  }\n'], ['\n  background: #F1F3F4;\n  border: none;\n  border-radius: 3px;\n  outline: none;\n  font-size: large;\n  display: inline-block;\n  width: 100%;\n  color: #69626D;\n  font-weight: 400;\n  &::-webkit-input-placeholder {\n    font-weight: 100;\n    font-style: italic;\n    color: #69626D;\n  }\n']);

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }
/* eslint-disable import/first */
import styled from 'styled-components';

var Input = styled.input(_templateObject);

export default Input;