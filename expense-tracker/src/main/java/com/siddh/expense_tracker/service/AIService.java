package com.siddh.expense_tracker.service;

import com.siddh.expense_tracker.entity.Transaction;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AIService {
    private final ChatClient chatClient;


    public AIService(ChatClient.Builder chatClientBuilder) {
        this.chatClient = chatClientBuilder.build();
    }

    public String returnContent(String prompt){
        return chatClient.prompt(prompt)
                .call().content();
    }

    public String generateTransactionAdvice(List<Transaction> transactionList){
        if(transactionList==null || transactionList.isEmpty()){
            return "No Transaction done currently. Please do some transactions then try.";
        }



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

        String prompt = """
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
                """.formatted(data.toString());

        return chatClient.prompt(prompt)
                .call().content();
    }
}
