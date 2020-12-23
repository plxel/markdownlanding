import styled from 'styled-components';
import Box from './Box';

const Input = styled(Box).attrs({
  as: 'input',
  p: 2,
  fontSize: 3,
  border: 1,
  borderRadius: 2,
})``;

export default Input;
