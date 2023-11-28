import {Component, Vue} from 'vue-facing-decorator';
import {useToast} from "vue-toastification";
import axios from 'axios';
import {PfButton} from '@profabric/vue-components';

@Component({
    components: {
        'pf-button': PfButton
    }
})
export default class Movies extends Vue {

    private movies:any = [];
    private toast = useToast();
    private togleModalVar = false;
    private showModalStyle = {display: 'block', background: 'rgb(0 0 0 / 80%)'};
    private hideModalStyle = 'display: none';

    private name = '';
    private release_date = '';
    private picture_file_path = '';
    private minutes_length = '';

    private isLoading = false;
    private isEditing = false;

    public async mounted() {
        axios.defaults.headers.common['authorization'] = 'Bearer ' + localStorage.getItem('jwt');
        try {
            const result = await axios.get('http://localhost/api/v1/movies');
            this.movies = result.data;
        } catch (error: any) {
            console.log(error);
            this.toast.error('Error al extraer los datos: ' + error.response.data.message);
        }

    }

    public async store() {
        this.isLoading = true;
        try {
            axios.defaults.headers.common['authorization'] = 'Bearer ' + localStorage.getItem('jwt');
            let formData = new FormData();
            formData.append('name', this.name);
            formData.append('release_date', this.release_date);
            formData.append('picture_file_path', this.picture_file_path);
            formData.append('minutes_length', this.minutes_length);

            let result: any;
            if (!this.isEditing) {
                result = await axios.post('http://localhost/api/v1/movies', formData);
                this.movies.push(result.data);
            } else {
                formData.append('_method', 'put');
                result = await axios.post('http://localhost/api/v1/movies/' + this.isEditing, formData);
                console.log(result.data)
                this.movies = this.movies.map((el) => el.id === result.data.id ? result.data:el);
            }


            this.toggleModal();
        } catch (error: any) {
            this.toast.error('Error al extraer los datos: ' + error.response.data.message);
        }
        this.isLoading = false;
    }

    public async remove(id:number) {

        try {
            axios.defaults.headers.common['authorization'] = 'Bearer ' + localStorage.getItem('jwt');
            await axios.delete('http://localhost/api/v1/movies/' + id);
            this.movies = this.movies.filter((el) => el.id !== id);
        } catch (error:any) {
            this.toast.error('Error al eliminar el elemento: ' + error.response.data.message);
        }
    }

    public edit(movie) {
        this.toggleModal();
        this.isEditing = movie.id;
        this.name = movie.name;
        this.release_date = movie.release_date;
        this.minutes_length = movie.minutes_length;
    }

    public refreshForm() {
        this.name = '';
        this.release_date = '';
        this.picture_file_path = '';
        this.minutes_length = '';
        this.$refs.fileInput.value = null;
        this.isEditing = false;
    }

    public onFilePicked(event) {
        const files = event.target.files
        let filename = files[0].name
        const fileReader = new FileReader()
        //fileReader.addEventListener('load', () => {
        //    this.imageUrl = fileReader.result
        //})
        fileReader.readAsDataURL(files[0])
        this.picture_file_path = files[0]
        console.log(this.picture_file_path)
    }

    public toggleModal () {
        this.refreshForm();
        this.togleModalVar = !this.togleModalVar;
    }
}
