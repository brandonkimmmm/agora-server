import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class GetTopicsAvailableDTO {
    @IsOptional()
    @IsString()
    @MinLength(3)
    @MaxLength(20)
    readonly search?: string;
}
