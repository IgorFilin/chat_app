interface UserType {
  id: string;
  name: string;
}

interface UserTypeInUsersArrayType extends UserType {
  online: string;
}

interface MessageType {
  message: Array<Array<number | string>> | string;
  userId: string;
  name: string;
  userPhoto: string;
  roomId: string | null;
  event: 'private_message' | 'message';
}
