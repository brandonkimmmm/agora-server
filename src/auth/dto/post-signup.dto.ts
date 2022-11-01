import { Transform } from 'class-transformer';
import {
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsString,
    Matches,
    MaxLength,
    MinLength
} from 'class-validator';
import { PASSWORD_REGEX } from 'src/shared/constants';
import { IsEqualTo } from 'src/shared/decorators/equal-to.decorator';

export class PostSignupDTO {
    @IsOptional()
    @IsEmail()
    @Transform(({ value }) => value.toLowerCase())
    readonly email?: string;

    @Matches(PASSWORD_REGEX)
    readonly password: string;

    @IsEqualTo('password')
    readonly password_confirmation: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    readonly first_name?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    readonly last_name?: string;

    @IsString()
    @Transform(({ value }) => value.trim())
    @MinLength(4)
    @MaxLength(10)
    readonly username: string;
}
