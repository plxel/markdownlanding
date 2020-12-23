import styled from 'styled-components';
import Box from './Box';

const Textarea = styled(Box).attrs({
  as: 'textarea',
  p: 2,
  fontSize: 3,
  border: 1,
  borderRadius: 2,
})`
  resize: vertical;
`;

export default Textarea;
