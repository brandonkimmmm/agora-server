import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsPositive } from 'class-validator';
import { PaginationDTO } from 'src/shared/dto/pagination.dto';

export class GetPostsDTO extends PaginationDTO {
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @IsPositive()
    readonly user_id?: number;
}
