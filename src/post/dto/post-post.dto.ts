import {
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUrl,
    Matches,
    MaxLength,
    MinLength,
    ValidateIf
} from 'class-validator';
import { isUndefined } from 'lodash';
import { TOPIC_TITLE_REGEX } from 'src/shared/constants';

export class PostPostDTO {
    @IsOptional()
    @IsString()
    @MinLength(3)
    @MaxLength(20)
    @Matches(TOPIC_TITLE_REGEX)
    readonly topic_title: string;

    @IsOptional()
    @IsUrl()
    @ValidateIf((o) => isUndefined(o.link_url) || o.media_url)
    readonly media_url?: string;

    @IsOptional()
    @IsUrl()
    @ValidateIf((o) => isUndefined(o.media_url) || o.link_url)
    readonly link_url?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    readonly body?: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(300)
    readonly title: string;
}
