import {Component, Vue} from 'vue-facing-decorator';
import Input from '@/components/input/input.vue';
import {useToast} from 'vue-toastification';
import {PfButton, PfCheckbox} from '@profabric/vue-components';
import {GoogleProvider, userRegister} from '@/utils/oidc-providers';

@Component({
    components: {
        'app-input': Input,
        'pf-checkbox': PfCheckbox,
        'pf-button': PfButton
    }
})
export default class Register extends Vue {
    private appElement: HTMLElement | null = null;
    public name: string = '';
    public email: string = '';
    public password: string = '';
    public rePassword: string = '';
    public agreeTerms: boolean = false;
    public isAuthLoading: boolean = false;
    public isGoogleLoading: boolean = false;
    private toast = useToast();

    public mounted(): void {
        this.appElement = document.getElementById('app') as HTMLElement;
        this.appElement.classList.add('register-page');
    }

    public unmounted(): void {
        (this.appElement as HTMLElement).classList.remove('register-page');
    }

    public async registerByAuth(): Promise<void> {
        try {
            this.isAuthLoading = true;
            const response = await userRegister(this.name, this.email, this.password, this.rePassword);
            this.$store.dispatch('auth/setAuthentication', response);
            this.toast.success('Register succeeded');
            this.isAuthLoading = false;
            this.$router.replace('/');
        } catch (error: any) {
            this.toast.error(error.message);
            this.isAuthLoading = false;
        }
    }

    public async registerByGoogle(): Promise<void> {
        try {
            this.isGoogleLoading = true;
            const response = await GoogleProvider.signinPopup();
            this.$store.dispatch('auth/setAuthentication', response);
            this.toast.success('Register succeeded');
            this.isGoogleLoading = false;
            this.$router.replace('/');
        } catch (error: any) {
            this.toast.error(error.message);
            this.isGoogleLoading = false;
        }
    }
}
