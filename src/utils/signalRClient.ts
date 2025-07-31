import * as signalR from '@microsoft/signalr';

let connection: signalR.HubConnection | null = null;

export const startSignalRConnection = async (token: string) => {
  if (connection) return connection;

  connection = new signalR.HubConnectionBuilder()
    .withUrl(`${import.meta.env.VITE_API_URL}/notificationHub`, {
      accessTokenFactory: () => token
    })
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Information)
    .build();

  try {
    await connection.start();
    console.log('SignalR Connected');
  } catch (err) {
    console.error('SignalR Connection Error: ', err);
  }

  return connection;
};

export const getConnection = () => connection;

export const stopSignalRConnection = async () => {
  if (connection) {
    await connection.stop();
    connection = null;
  }
};