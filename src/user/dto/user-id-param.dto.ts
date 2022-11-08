import { Type } from 'class-transformer';
import { IsInt, IsPositive } from 'class-validator';

export class UserIdParamDTO {
    @Type(() => Number)
    @IsInt()
    @IsPositive()
    readonly user_id: number;
}
