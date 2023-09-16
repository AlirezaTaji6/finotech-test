import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { isEnum } from 'class-validator';
import { CommonErrors, SortValues } from '../enums';

@Injectable()
export class SortPipe implements PipeTransform {
  constructor(public allowedFields: any) {}

  transform(data: any) {
    data?.sort &&
      Object.keys(data.sort).map((k) => {
        if (
          !isEnum(k, this.allowedFields) ||
          !isEnum(data.sort[k], SortValues)
        ) {
          throw new BadRequestException(CommonErrors.SORT_VALIDATION_FAILED);
        }
      });

    return data;
  }
}
