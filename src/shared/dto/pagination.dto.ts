import { Expose, Type } from 'class-transformer';
import { IsInt, IsPositive, Max } from 'class-validator';
import Default from '../decorators/default.decorator';

export class PaginationDTO {
    @Expose()
    @Default(50)
    @Type(() => Number)
    @IsInt()
    @IsPositive()
    @Max(50)
    readonly limit: number;

    @Expose()
    @Default(1)
    @Type(() => Number)
    @IsInt()
    @IsPositive()
    readonly page: number;
}
