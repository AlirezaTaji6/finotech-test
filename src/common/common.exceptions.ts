import { ServiceUnavailableException } from '@nestjs/common';
import { CommonErrors } from './enums/common-messages.enum';

export class UpdateFailed extends ServiceUnavailableException {
  constructor() {
    super(CommonErrors.UPDATE_FAILED);
  }
}

export class RemoveFailed extends ServiceUnavailableException {
  constructor() {
    super(CommonErrors.DELETE_FAILED);
  }
}
