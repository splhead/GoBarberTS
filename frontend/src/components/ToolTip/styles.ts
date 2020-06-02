import styled from 'styled-components';
import colors from '../../styles/colors';

export const Container = styled.div`
  position: relative;

  span {
    background: ${colors.primary};
    border-radius: 4px;
    bottom: calc(100% + 12px);
    color: ${colors.buttonText};
    font-size: 14px;
    font-weight: 500;
    left: 50%;
    padding: 8px;
    position: absolute;
    opacity: 0;
    transition: opacity 0.4s;
    transform: translateX(-50%);
    visibility: hidden;
    width: 160px;

    &::before {
      content: '';
      border-style: solid;
      border-color: ${colors.primary} transparent;
      border-width: 6px 6px 0 6px;
      bottom: 20px;
      left: 50%;
      position: absolute;
      top: 100%;
      transform: translateX(-50%);
    }
  }

  &:hover span {
    opacity: 1;
    visibility: visible;
  }
`;
