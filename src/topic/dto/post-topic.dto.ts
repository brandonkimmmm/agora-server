import {
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUrl,
    NotContains
} from 'class-validator';

export class PostTopicDTO {
    @IsString()
    @IsNotEmpty()
    @NotContains(' ', { message: 'No spaces allowed' })
    readonly title: string;

    @IsOptional()
    @IsString()
    @NotContains(' ', { message: 'No spaces allowed' })
    readonly display_title?: string;

    @IsOptional()
    @IsUrl()
    readonly image_url?: string;

    @IsString()
    @IsNotEmpty()
    readonly description: string;
}
