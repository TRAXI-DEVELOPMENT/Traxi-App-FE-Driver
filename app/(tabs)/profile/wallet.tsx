import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";

const getWeek = (date) => {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const dayNum = d.getDay() || 7; // Get the day number, with Sunday as 7
  d.setDate(d.getDate() + 4 - dayNum); // Set the date to the nearest Thursday
  const yearStart = new Date(d.getFullYear(), 0, 1);
  const weekNum = Math.ceil(((d - yearStart) / 86400000 + 1) / 7); // Calculate the week number
  return weekNum;
};

const getMonth = (date) => {
  return date.getMonth() + 1;
};

export default function Wallet() {
  const [date, setDate] = useState(new Date());
  const [week, setWeek] = useState(getWeek(new Date()));
  const [month, setMonth] = useState(getMonth(new Date()));
  const [income, setIncome] = useState(0);
  const [payments, setPayments] = useState([]);

  // Sample data for income and payments
  const sampleData = {
    income: 5000,
    payments: [
      { id: 1, date: "2024-06-01", amount: 1000 },
      { id: 2, date: "2024-06-05", amount: 2000 },
      { id: 3, date: "2024-06-10", amount: 1500 },
    ],
  };

  // Cập nhật thông tin khi ngày thay đổi
  useEffect(() => {
    setIncome(sampleData.income);
    setPayments(sampleData.payments);
    setWeek(getWeek(date));
    setMonth(getMonth(date));
  }, [date]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Thu nhập và các khoản thanh toán khác</Text>
        <View style={styles.headerDate}>
          <Text style={styles.headerDateText}>Ngày: {date.toLocaleDateString()}</Text>
          <Text style={styles.headerDateText}>Tuần: {week}</Text>
          <Text style={styles.headerDateText}>Tháng: {month}</Text>
        </View>
      </View>
      <View style={styles.incomeSection}>
        <Text style={styles.incomeTitle}>Tổng thu nhập</Text>
        <Text style={styles.incomeAmount}>{income.toLocaleString()}</Text>
      </View>
      <View style={styles.paymentsSection}>
        <Text style={styles.paymentsTitle}>Lịch sử thanh toán</Text>
        {payments.map((payment) => (
          <View key={payment.id} style={styles.paymentItem}>
            <Text style={styles.paymentDate}>{payment.date}</Text>
            <Text style={styles.paymentAmount}>{payment.amount.toLocaleString()}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  headerDate: {
    flexDirection: "row",
    marginTop: 10,
  },
  headerDateText: {
    fontSize: 16,
    marginRight: 10,
  },
  incomeSection: {
    marginBottom: 20,
  },
  incomeTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  incomeAmount: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#008000",
  },
  paymentsSection: {
    marginBottom: 20,
  },
  paymentsTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  paymentItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 1,
  },
  paymentDate: {
    marginRight: 10,
  },
  paymentAmount: {
    fontWeight: "bold",
  },
});
