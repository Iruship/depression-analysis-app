import tensorflow as tf
import tensorflowjs as tfjs

# Load the saved model
model = tf.keras.models.load_model('depression_detection_model.h5')

# Convert and save the model in TensorFlow.js format
tfjs.converters.save_keras_model(model, './model')
print("Model converted and saved in './model' for TensorFlow.js")
