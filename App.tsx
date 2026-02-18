import React, {useMemo, useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
} from 'react-native';
import {useExpenses, type Expense} from './src/store/expenses';

export default function App() {
  const {expenses, addExpense, removeExpense, clear} = useExpenses();

  const [amountStr, setAmountStr] = useState('');
  const [category, setCategory] = useState('food');
  const [note, setNote] = useState('');

  const total = useMemo(
    () => expenses.reduce((acc, e) => acc + e.amount, 0),
    [expenses],
  );

  const onAdd = () => {
    const amount = Number(amountStr.replace(',', '.'));
    if (!Number.isFinite(amount) || amount <= 0) return;
    addExpense({amount, category: category.trim() || 'misc', note: note.trim() || undefined});
    setAmountStr('');
    setNote('');
  };

  const renderItem = ({item}: {item: Expense}) => (
    <View style={{paddingVertical: 10, borderBottomWidth: 1}}>
      <Text style={{fontSize: 16}}>
        {item.amount.toFixed(2)} · {item.category}
      </Text>
      {!!item.note && <Text style={{opacity: 0.7}}>{item.note}</Text>}
      <Pressable onPress={() => removeExpense(item.id)} style={{marginTop: 6}}>
        <Text style={{color: 'crimson'}}>Delete</Text>
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView style={{flex: 1, padding: 16}}>
      <Text style={{fontSize: 22, fontWeight: '700'}}>Money Tracker</Text>
      <Text style={{marginTop: 6, marginBottom: 12}}>Total: {total.toFixed(2)}</Text>

      <View style={{gap: 8, marginBottom: 12}}>
        <TextInput
          value={amountStr}
          onChangeText={setAmountStr}
          placeholder="Amount (e.g. 12.50)"
          keyboardType="decimal-pad"
          style={{borderWidth: 1, padding: 12, borderRadius: 10}}
        />
        <TextInput
          value={category}
          onChangeText={setCategory}
          placeholder="Category"
          style={{borderWidth: 1, padding: 12, borderRadius: 10}}
        />
        <TextInput
          value={note}
          onChangeText={setNote}
          placeholder="Note (optional)"
          style={{borderWidth: 1, padding: 12, borderRadius: 10}}
        />

        <View style={{flexDirection: 'row', gap: 10}}>
          <Pressable onPress={onAdd} style={{padding: 12, borderWidth: 1, borderRadius: 10}}>
            <Text>Add</Text>
          </Pressable>
          <Pressable onPress={clear} style={{padding: 12, borderWidth: 1, borderRadius: 10}}>
            <Text>Clear</Text>
          </Pressable>
        </View>
      </View>

      <FlatList
        data={expenses}
        keyExtractor={(e) => e.id}
        renderItem={renderItem}
      />
    </SafeAreaView>
  );
}
