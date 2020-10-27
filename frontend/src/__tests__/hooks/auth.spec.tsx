import { renderHook, act } from '@testing-library/react-hooks';
import MockAdapter from 'axios-mock-adapter';
import { useAuth, AuthProvider } from '../../hooks/auth';
import api from '../../services/api';

const apiMock = new MockAdapter(api);

describe('Auth hook', () => {
  it('should be able to sign in', async () => {
    const apiResponse = {
      user: {
        id: 'user-id',
        name: 'Jonh Doe',
        email: 'jonhdoe@example.com',
      },
      token: 'token',
    };

    apiMock.onPost('sessions').reply(200, apiResponse);

    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

    const { result, waitForNextUpdate } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    result.current.signIn({
      email: 'jonhdoe@example.com',
      password: '123456',
    });

    await waitForNextUpdate();

    expect(setItemSpy).toBeCalledWith('@GoBarber:token', apiResponse.token);
    expect(setItemSpy).toBeCalledWith(
      '@GoBarber:user',
      JSON.stringify(apiResponse.user),
    );
    expect(result.current.user.email).toEqual('jonhdoe@example.com');
  });

  it('should restore saved data from storage when auth inits', () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
      switch (key) {
        case '@GoBarber:token':
          return 'token';
        case '@GoBarber:user':
          return JSON.stringify({
            id: 'user-id',
            name: 'Jonh Doe',
            email: 'jonhdoe@example.com',
          });
        default:
          return null;
      }
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    expect(result.current.user.email).toEqual('jonhdoe@example.com');
  });

  it('should be able to sign out', () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
      switch (key) {
        case '@GoBarber:token':
          return 'token';
        case '@GoBarber:user':
          return JSON.stringify({
            id: 'user-id',
            name: 'Jonh Doe',
            email: 'jonhdoe@example.com',
          });
        default:
          return null;
      }
    });

    const removeItem = jest.spyOn(Storage.prototype, 'removeItem');

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    act(() => {
      result.current.signOut();
    });

    expect(removeItem).toHaveBeenCalledTimes(2);
    expect(result.current.user).toBeUndefined();
  });

  it('should be able to update user data', async () => {
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    const user = {
      id: 'user-id',
      name: 'Jonh Doe',
      email: 'jonhdoe@example.com',
      avatar_url: 'image.jpg',
    };

    act(() => {
      result.current.updateUser(user);
    });

    expect(setItemSpy).toBeCalledWith('@GoBarber:user', JSON.stringify(user));
    expect(result.current.user).toEqual(user);
  });
});
