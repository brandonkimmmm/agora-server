import { Type } from 'class-transformer';
import { IsInt, IsPositive } from 'class-validator';
import { ParamPostIdDTO } from './post-param-id.dto';

export class ParamCommentIdDTO extends ParamPostIdDTO {
    @Type(() => Number)
    @IsInt()
    @IsPositive()
    readonly comment_id: number;
}
