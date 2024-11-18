import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, StyleSheet, FlatList, Alert, TouchableOpacity, ScrollView } from 'react-native';
import axios from 'axios';

export default function App() {
    const [jsonInput, setJsonInput] = useState('');
    const [configs, setConfigs] = useState([]);
    const [isValidJson, setIsValidJson] = useState(true);
    const [editingConfig, setEditingConfig] = useState(null);

    const validateJson = (input: string) => {
        try {
            JSON.parse(input);
            setIsValidJson(true);
            return true;
        } catch (error) {
            setIsValidJson(false);
            return false;
        }
    };

    const fetchConfigs = () => {
        axios.get('http://raspberrypi:8080/config')
            .then(response => {
                setConfigs(response.data);
            })
            .catch(error => {
                console.error(error);
                Alert.alert('Error', 'Failed to fetch configurations.');
            });
    };

    const sendJsonToBackend = () => {
        if (!validateJson(jsonInput)) {
            Alert.alert('Invalid JSON', 'Please enter a valid JSON object.');
            return;
        }

        const parsedJson = JSON.parse(jsonInput);

        axios.post('http://raspberrypi:8080/config', parsedJson)
            .then(response => {
                Alert.alert('Success', 'Configuration sent successfully!');
                fetchConfigs();
                setJsonInput('');
            })
            .catch(error => {
                console.error(error);
                Alert.alert('Error', 'Failed to send configuration.');
            });
    };

    const editConfig = (config: React.SetStateAction<null>) => {
        setEditingConfig(config);
        setJsonInput(JSON.stringify(config, null, 2));
    };

    const updateConfig = () => {
        if (!validateJson(jsonInput)) {
            Alert.alert('Invalid JSON', 'Please enter a valid JSON object.');
            return;
        }

        const parsedJson = JSON.parse(jsonInput);

        if (editingConfig) {
            axios.post('http://raspberrypi:8080/config', parsedJson)
                .then(response => {
                    Alert.alert('Success', 'Configuration updated successfully!');
                    fetchConfigs();
                    setEditingConfig(null);
                    setJsonInput('');
                })
                .catch(error => {
                    console.error(error);
                    Alert.alert('Error', 'Failed to update configuration.');
                });
        }
    };

    const clearConfigs = () => {
        axios.delete('http://raspberrypi:8080/config')
            .then(response => {
                Alert.alert('Success', 'All configurations cleared.');
                setConfigs([]);
            })
            .catch(error => {
                console.error(error);
                Alert.alert('Error', 'Failed to clear configurations.');
            });
    };

    useEffect(() => {
        fetchConfigs();
    }, []);

    // @ts-ignore
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}>Configuration Manager</Text>
            <Text style={styles.label}>Enter JSON Configuration:</Text>
            <TextInput
                style={[styles.textInput, !isValidJson && styles.errorInput]}
                placeholder="Enter your JSON configuration here"
                multiline
                value={jsonInput}
                onChangeText={(text) => {
                    setJsonInput(text);
                    validateJson(text);
                }}
            />
            {!isValidJson && <Text style={styles.errorText}>Invalid JSON format</Text>}

            <View style={styles.buttonContainer}>
                <Button title={editingConfig ? "Update Configuration" : "Send to Backend"} onPress={editingConfig ? updateConfig : sendJsonToBackend} />
            </View>

            <Text style={styles.label}>Current Configurations:</Text>
            {configs.length === 0 ? (
                <Text style={styles.noConfigText}>No configurations available.</Text>
            ) : (
                <FlatList
                    data={configs}
                    keyExtractor={(item) => item.ID.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.configCard}>
                            <Text style={styles.configText}>Topic: <Text style={styles.bold}>{item.Topic}</Text></Text>
                            <Text style={styles.configText}>Message: <Text style={styles.bold}>{item.Message}</Text></Text>
                            <Text style={styles.configText}>Time: <Text style={styles.bold}>{item.Time}</Text></Text>
                            <TouchableOpacity style={styles.editButton} onPress={() => editConfig(item)}>
                                <Text style={styles.editButtonText}>Edit</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                />
            )}

            <TouchableOpacity style={styles.clearButton} onPress={clearConfigs}>
                <Text style={styles.clearButtonText}>Clear All Configurations</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f8f9fa',
    },
    header: {
        fontSize: 24,
        fontWeight: '600',
        color: '#333',
        marginBottom: 20,
        textAlign: 'center',
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        color: '#444',
        marginBottom: 8,
    },
    textInput: {
        height: 120,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#fff',
        marginBottom: 15,
        textAlignVertical: 'top',
    },
    errorInput: {
        borderColor: 'red',
    },
    errorText: {
        color: 'red',
        fontSize: 14,
        marginBottom: 10,
    },
    buttonContainer: {
        marginBottom: 20,
    },
    configCard: {
        backgroundColor: '#ffffff',
        borderRadius: 8,
        padding: 15,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    configText: {
        fontSize: 16,
        color: '#555',
        marginBottom: 5,
    },
    bold: {
        fontWeight: '600',
    },
    noConfigText: {
        fontSize: 16,
        color: '#888',
        textAlign: 'center',
    },
    editButton: {
        backgroundColor: '#3498db',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        marginTop: 10,
        alignItems: 'center',
    },
    editButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    clearButton: {
        backgroundColor: '#e74c3c',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    clearButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
});
