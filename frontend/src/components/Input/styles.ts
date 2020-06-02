import styled, { css } from 'styled-components';
import ToolTip from '../ToolTip';
import colors from '../../styles/colors';

interface ContainerProps {
  isFocused: boolean;
  isFilled: boolean;
  isErrored: boolean;
}

export const Container = styled.div<ContainerProps>`
  background: ${colors.inputBg};
  border: 2px solid ${colors.inputBg};
  border-radius: 10px;
  display: flex;
  align-items: center;
  padding: 16px;
  width: 100%;
  color: ${colors.placeholder};

  & + div {
    margin-top: 8px;
  }

  ${(props) =>
    props.isErrored &&
    css`
      border-color: ${colors.error};
    `}

  ${(props) =>
    props.isFocused &&
    css`
      color: ${colors.primary};
      border-color: ${colors.primary};
    `}

  ${(props) =>
    props.isFilled &&
    css`
      color: ${colors.primary};
    `};

  input {
    background: transparent;
    border: 0;
    color: ${colors.light};
    flex: 1;

    &::placeholder {
      color: ${colors.placeholder};
    }
  }

  svg {
    margin-right: 16px;
  }
`;

export const Error = styled(ToolTip)`
  height: 20px;
  margin-left: 16px;

  svg {
    margin: 0;
  }

  span {
    background: ${colors.error};
    color: ${colors.white};

    &::before {
      border-color: ${colors.error} transparent;
    }
  }
`;
