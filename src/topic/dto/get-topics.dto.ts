import {
    IsOptional,
    IsString,
    Matches,
    MaxLength,
    MinLength
} from 'class-validator';
import { TOPIC_TITLE_REGEX } from 'src/shared/constants';
import { PaginationDTO } from 'src/shared/dto/pagination.dto';

export class GetTopicsDTO extends PaginationDTO {
    @IsOptional()
    @IsString()
    @MinLength(3)
    @MaxLength(10)
    @Matches(TOPIC_TITLE_REGEX)
    readonly display_title?: string;
}
