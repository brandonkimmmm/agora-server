import { Transform } from 'class-transformer';
import { IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { PASSWORD_REGEX } from 'src/shared/constants';

export class PostLoginDTO {
    @IsString()
    @Transform(({ value }) => value.trim())
    @MinLength(4)
    @MaxLength(10)
    readonly username: string;

    @Matches(PASSWORD_REGEX)
    readonly password: string;
}
