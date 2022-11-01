import {
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUrl,
    Matches,
    MaxLength,
    MinLength
} from 'class-validator';
import { TOPIC_TITLE_REGEX } from 'src/shared/constants';

export class PostTopicDTO {
    @IsOptional()
    @IsString()
    @MinLength(3)
    @MaxLength(10)
    @Matches(TOPIC_TITLE_REGEX)
    readonly display_title: string;

    @IsOptional()
    @IsUrl()
    readonly image_url?: string;

    @IsString()
    @IsNotEmpty()
    readonly description: string;
}
