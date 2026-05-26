package com.siddh.expense_tracker.dto;

import java.util.List;

public class AITransactionAdviceResponse {
    private String summary;
    private List<String>topCategories;
    private List<String>overspendingAreas;
    private List<String>savingTips;
    private String budgetSuggestion;

    public AITransactionAdviceResponse(String summary, List<String> topCategories, List<String> overspendingAreas, List<String> savingTips, String budgetSuggestion) {
        this.summary = summary;
        this.topCategories = topCategories;
        this.overspendingAreas = overspendingAreas;
        this.savingTips = savingTips;
        this.budgetSuggestion = budgetSuggestion;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public List<String> getTopCategories() {
        return topCategories;
    }

    public void setTopCategories(List<String> topCategories) {
        this.topCategories = topCategories;
    }

    public List<String> getOverspendingAreas() {
        return overspendingAreas;
    }

    public void setOverspendingAreas(List<String> overspendingAreas) {
        this.overspendingAreas = overspendingAreas;
    }

    public List<String> getSavingTips() {
        return savingTips;
    }

    public void setSavingTips(List<String> savingTips) {
        this.savingTips = savingTips;
    }

    public String getBudgetSuggestion() {
        return budgetSuggestion;
    }

    public void setBudgetSuggestion(String budgetSuggestion) {
        this.budgetSuggestion = budgetSuggestion;
    }
}
