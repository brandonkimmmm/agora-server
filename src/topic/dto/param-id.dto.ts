import { Type } from 'class-transformer';
import { IsInt, IsPositive } from 'class-validator';

export class ParamTopicIdDTO {
    @Type(() => Number)
    @IsInt()
    @IsPositive()
    readonly topic_id: number;
}
