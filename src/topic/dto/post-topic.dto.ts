import { IsNotEmpty, IsString, NotContains } from 'class-validator';

export class PostTopicDTO {
    @IsString()
    @IsNotEmpty()
    @NotContains(' ', { message: 'No spaces allowed' })
    readonly title: string;

    @IsString()
    @IsNotEmpty()
    readonly description: string;
}
