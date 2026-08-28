import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/global.css';
import { mount } from 'svelte';
import App from './App.svelte';

var app = mount(App, {
	target: document.body
});

window.app = app;

export default app;
