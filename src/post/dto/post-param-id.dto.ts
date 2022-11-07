import { Type } from 'class-transformer';
import { IsInt, IsPositive } from 'class-validator';

export class ParamPostIdDTO {
    @Type(() => Number)
    @IsInt()
    @IsPositive()
    readonly post_id: number;
}
