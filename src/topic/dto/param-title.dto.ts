import { IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { TOPIC_TITLE_REGEX } from 'src/shared/constants';

export class ParamTopicTitleDTO {
    @IsString()
    @MinLength(3)
    @MaxLength(20)
    @Matches(TOPIC_TITLE_REGEX)
    readonly topic_title: string;
}
