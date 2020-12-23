import { buttonStyle } from 'styled-system';
import styled from 'styled-components';
import Box from './Box';

const Button = styled(Box).attrs({
  as: 'button',
  p: 2,
  fontSize: 3,
  border: 1,
  borderRadius: 2,
  color: 'white',
})`
  outline: none;
  cursor: pointer;
  ${buttonStyle};
`;

export default Button;
