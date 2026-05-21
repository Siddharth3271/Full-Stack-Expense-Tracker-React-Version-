package com.siddh.expense_tracker.dto;

public class AITransactionResult{
    private String advice;

    public AITransactionResult(){

    }

    public AITransactionResult(String advice){
        this.advice=advice;
    }

    public String getAdvice(){
        return advice;
    }

    public void setAdvice(String advice){
        this.advice=advice;
    }
}
