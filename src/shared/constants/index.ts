export const PASSWORD_REGEX =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*([!@#$%^&*]))(?=.*(\d))[A-Za-z\d!@#$%^&*]{8,20}$/;

export const USER_ROLE = {
    ADMIN: 'ADMIN',
    USER: 'USER'
};

export const TOPIC_TITLE_REGEX = /^[\da-zA-Z_]*$/;
