import { Module } from "@nestjs/common";
import { InvoiceController } from "./invoice.controller";
import { ExpenseController } from "./expense.controller";
import { FinanceService } from "./finance.service";

@Module({
  controllers: [InvoiceController, ExpenseController],
  providers: [FinanceService],
})
export class FinanceModule {}