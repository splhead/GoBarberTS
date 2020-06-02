import styled from 'styled-components';
import { shade } from 'polished';
import colors from '../../styles/colors';

import signupBackgroundImage from '../../assets/sign-up-background.png';

export const Container = styled.div`
  align-items: stretch;
  display: flex;
  height: 100vh;
`;

export const Content = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  max-width: 700px;
  width: 100%;
  padding: 20px 0;

  form {
    margin: 20px 0;
    text-align: center;
    width: 340px;

    h1 {
      margin-bottom: 24px;
    }

    a {
      color: ${colors.light};
      display: block;
      margin-top: 24px;
      transition: color 0.2s;

      &:hover {
        color: ${shade(0.2, colors.light)};
      }
    }
  }

  > a {
    align-items: center;
    color: ${colors.light};
    display: flex;
    margin-top: 24px;
    transition: color 0.2s;

    &:hover {
      color: ${shade(0.2, colors.light)};
    }

    svg {
      margin-right: 16px;
    }
  }
`;

export const Background = styled.div`
  flex: 1;
  background: url(${signupBackgroundImage}) no-repeat center;
  background-size: cover;
`;