import { IsNotEmpty, IsNumber, IsString, Length } from "class-validator";

export class createUserModel {
  @Length(5, 15)
  @IsString()
  username: string;
  @IsString()
  @IsNotEmpty()
  first_name: string;
  @IsString()
  @IsNotEmpty()
  last_name: string;
  @IsString()
  @IsNotEmpty()
  password: string;
  @IsNumber()
  @IsNotEmpty()
  role: number;
}

export class credentialsModel {
  @IsString()
  @Length(5, 15)
  username: string;
  @IsString()
  @IsNotEmpty()
  password: string;
}
