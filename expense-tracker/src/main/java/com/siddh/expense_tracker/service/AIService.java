package com.siddh.expense_tracker.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.siddh.expense_tracker.dto.AITransactionAdviceResponse;
import com.siddh.expense_tracker.entity.Transaction;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AIService {
    private final ChatClient chatClient;
    private final ObjectMapper objectMapper;

    public AIService(ChatClient.Builder chatClientBuilder, ObjectMapper objectMapper) {
        this.chatClient = chatClientBuilder.build();
        this.objectMapper = objectMapper;
    }

    public String returnContent(String prompt){
        return chatClient.prompt(prompt)
                .call().content();
    }

    public String generateTransactionAdvice(List<Transaction> transactionList){
        if(transactionList==null || transactionList.isEmpty()){
            return "No Transaction done currently. Please do some transactions then try.";
        }

        String data=buildTransactionData(transactionList);

        String prompt= """
                You are a personal finance assistant.

                Analyze these expense tracker transactions and give:
                1. A short spending summary
                2. Top spending categories
                3. Possible overspending areas
                4. Three practical money-saving tips
                5. A simple budget suggestion

                Keep the answer clear and useful for a normal user.

                Transactions:
                %s
                """.formatted(data);

        return chatClient.prompt(prompt)
                .call().content();
    }

    public AITransactionAdviceResponse generateStructuredTransactionAdvice(List<Transaction> transactionsList){
        if(transactionsList==null || transactionsList.isEmpty()){
            return new AITransactionAdviceResponse(
                    "No Transaction done currently. Please do some transactions then try.",
                    List.of(),
                    List.of(),
                    List.of("Add some transactions to generate saving tips"),
                    "Add some transactions to generate saving tips"
            );
        }

        String data=buildTransactionData(transactionsList);

        String prompt= """
                You are a personal finance assistant.
                
                Analyze the following expense tracker transactions.
                
                Return ONLY valid JSON.
                Do not include markdown.
                Do not include ```json.
                Do not include text outside JSON.
                Do not return null values.
                If there is not enough data, return an empty array [] or a helpful string.
                
                The JSON must have exactly these fields:
                {
                  "summary": "short spending summary",
                  "topCategories": ["category 1", "category 2", "category 3"],
                  "overspendingAreas": ["area 1", "area 2"],
                  "savingTips": ["tip 1", "tip 2", "tip 3"],
                  "budgetSuggestion": "simple monthly budget suggestion"
                }
                
                Transactions:
                %s
                """.formatted(data);

        String aiResponse=chatClient.prompt(prompt).call().content();

        try{
            return objectMapper.readValue(aiResponse,AITransactionAdviceResponse.class);
        }
        catch(Exception ex){
            return new AITransactionAdviceResponse(
                    aiResponse,
                    List.of(),
                    List.of("AI returned text instead of valid JSON."),
                    List.of("Try again or reduce the number of transactions."),
                    "Could not create structured budget suggestion."
            );
        }
    }

    public String buildTransactionData(List<Transaction> transactionList){
        StringBuilder data=new StringBuilder();

        for(Transaction transaction:transactionList){
            String categoryName=transaction.getTransactionCategory()!=null
                    ? transaction.getTransactionCategory().getCategoryName()
                    : "Uncategorized";
            data.append("Date: ")
                    .append(transaction.getTransactionDate())
                    .append(", Amount")
                    .append(transaction.getTransactionAmount())
                    .append(", Category")
                    .append(transaction.getTransactionCategory().getCategoryName())
                    .append(", Type")
                    .append(transaction.getTransactionType())
                    .append(", \n");
        }

        return data.toString();
    }
}
