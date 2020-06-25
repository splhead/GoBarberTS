import styled from 'styled-components';
import { shade } from 'polished';
import colors from '../../styles/colors';

export const Container = styled.div`
  > header {
    height: 144px;
    background: ${colors.dashboardHeaderbg};

    display: flex;
    align-items: center;

    div {
      width: 100%;
      max-width: 1120px;
      margin: 0 auto;

      svg {
        color: #999591;
        width: 24px;
        height: 24px;
      }
    }
  }
`;

export const Content = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: -176px auto 0;

  width: 100%;
  padding: 20px 0;

  form {
    margin: 30px 0;
    text-align: center;
    display: flex;
    flex-direction: column;

    h1 {
      margin-bottom: 24px;
      font-size: 20px;
      text-align: left;
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
`;

export const AvatarInput = styled.div`
  margin-bottom: 32px;
  position: relative;
  align-self: center;

  img {
    width: 186px;
    height: 186px;
    border-radius: 50%;
  }

  label {
    position: absolute;
    width: 48px;
    height: 48px;
    border: 0;
    border-radius: 50%;
    background: ${colors.primary};
    right: 0;
    bottom: 0;
    transition: background-color 0.2s;

    display: flex;
    align-items: center;
    justify-content: center;

    input {
      display: none;
    }

    svg {
      width: 20px;
      height: 20px;
      color: ${colors.buttonText};
    }

    &:hover {
      background: ${shade(0.2, colors.primary)};
    }
  }
`;
