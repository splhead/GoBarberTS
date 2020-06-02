import styled from 'styled-components';
import { shade } from 'polished';
import colors from '../../styles/colors';

export const Container = styled.button`
  background: ${colors.primary};
  border: 0;
  border-radius: 10px;
  color: ${colors.buttonText};
  font-weight: 500;
  height: 56px;
  margin-top: 16px;
  padding: 0 16px;
  transition: background-color 0.2s;
  width: 100%;

  &:hover {
    background: ${shade(0.2, colors.primary)};
  }
`;
