import { Type } from 'class-transformer';
import {
    IsInt,
    IsOptional,
    IsPositive,
    IsString,
    Matches,
    MaxLength,
    MinLength,
    ValidateIf
} from 'class-validator';
import { isUndefined } from 'lodash';
import { TOPIC_TITLE_REGEX } from 'src/shared/constants';
import { PaginationDTO } from 'src/shared/dto/pagination.dto';

export class GetPostsDTO extends PaginationDTO {
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @IsPositive()
    readonly user_id?: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @IsPositive()
    @ValidateIf((o) => isUndefined(o.topic_title) || o.topic_id)
    readonly topic_id?: number;

    @IsOptional()
    @IsString()
    @MinLength(3)
    @MaxLength(10)
    @Matches(TOPIC_TITLE_REGEX)
    @ValidateIf((o) => isUndefined(o.topic_id) || o.topic_title)
    readonly topic_title?: string;
}
