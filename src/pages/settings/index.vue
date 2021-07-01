<template>
  <main>
    <section class="md:grid md:grid-cols-3">
      <article class="flex flex-col w-full">
        <h2 class="border-b-2 text-2xl bold pl-4 font-bold">
          Settings
        </h2>
        <button
          class="flex flex-row justify-between px-4 py-2 focus:outline-none"
          :class="this.isActiveTab('account') ? 'bg-gray1' : ''"
          @click="changeTab('account')"
        >
          Account Information
          <ChevronRight />
        </button>
        <button
          class="flex flex-row justify-between px-4 py-2 focus:outline-none"
          :class="this.isActiveTab('password') ? 'bg-gray1' : ''"
          @click="changeTab('password')"
        >
          Password Update
          <ChevronRight />
        </button>
        <button
          class="flex flex-row justify-between px-4 py-2 focus:outline-none"
          :class="this.isActiveTab('social') ? 'bg-gray1' : ''"
          @click="changeTab('social')"
        >
          Social Accounts
          <ChevronRight />
        </button>
      </article>

      <article v-if="this.tab === 'account'" class="col-span-2 border-l">
        <!-- General Settings (Username, ID, Email) -->
        <h2 class="border-b-2 text-2xl bold pl-4 font-bold">
          Account Information
        </h2>
        <div class="p-4 flex flex-col">
          <label for="profile_pic" class="text-sm text-gray5">Edit your profile:</label>
          <button
            class="self-center mb-2 text-xs text-gray4"
            @click="$refs.uploadedPic.click()"
          >
            <img
              v-if="this.$store.state.session.avatar !== null"
              :src="this.profilePic"
              class="w-32 h-32 rounded-lg object-cover"
            />
            <UploadAvatar v-else class="w-32 h-32 rounded-lg" />
            Change Avatar
          </button>
          <input
            id="file-input"
            ref="uploadedPic"
            class="hidden"
            name="file"
            type="file"
            accept="image/*"
            @change="handleImage"
          >
          <div class="flex flex-col">
            <label for="newName" class="hidden">Enter Name</label>
            <input
              id="newName"
              v-model="newName"
              type="text"
              :placeholder="this.$store.state.session.name"
              class="focus:outline-none border-b-2 w-64 text-xl mb-4 text-primary focus:border-primary"
            />

            <label for="newID" class="hidden">Enter ID</label>
            <input
              id="newID"
              v-model.trim="newID"
              type="text"
              :placeholder="this.$store.state.session.id"
              class="focus:outline-none border-b-2 w-64 text-xl mb-4 text-primary focus:border-primary"
            />

            <label for="newEmail" class="hidden">Enter email</label>
            <input
              id="newEmail"
              v-model="newEmail"
              type="email"
              :placeholder="this.$store.state.session.email"
              class="focus:outline-none border-b-2 w-64 text-xl mb-4 text-primary focus:border-primary"
            />

            <label for="location" class="hidden">Enter location</label>
            <input
              id="location"
              v-model="location"
              type="text"
              :placeholder="this.$store.state.session.location === '' ? 'Enter Location' : this.$store.state.session.location"
              class="focus:outline-none border-b-2 w-64 text-xl mb-4 text-primary focus:border-primary"
            />
          </div>
          <label for="bio">
            <h2 class="text-2xl bold text-primary">
              Bio:
            </h2>
          </label>
          <textarea
            id="bio"
            :maxlength="maxCharBio"
            :value="bio"
            rows="4"
            class="w-full border-b-2 focus:border-primary focus:outline-none p-1 resize-none text-gray5 focus:text-primary"
            @input="bio = $event.target.value"
            @keyup="checkBio()"
          ></textarea>
          <p class="text-xs text-right text-gray5">
            {{ this.checkBio() }} Characters Remaining
          </p>
        </div>
      </article>

      <article v-if="this.tab === 'password'" class="col-span-2 border-l">
        <h2 class="border-b-2 text-2xl bold pl-4 font-bold">
          Change Password
        </h2>
        <div class="flex flex-col p-4">
          <p class="text-gray5 mb-4">
            Choose a strong password to protect your account:
          </p>

          <label for="password" class="hidden">Current Password</label>
          <input
            id="password"
            type="password"
            class="w-full border rounded-lg focus:outline-none px-4 py-2 focus:border-primary"
            placeholder="Current Password"
          />

          <nuxt-link to="/help" class="text-right text-primary mb-2">
            Forgot Password?
          </nuxt-link>

          <label for="newPassword" class="hidden">New Password</label>
          <input
            id="newPassword"
            type="password"
            class="w-full border rounded-lg focus:outline-none px-4 py-2 focus:border-primary mb-2"
            placeholder="New Password"
          />

          <label for="confirmPassword" class="hidden">Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            class="w-full border rounded-lg focus:outline-none px-4 py-2 focus:border-primary"
            placeholder="Confirm Password"
          />
        </div>
      </article>

      <article v-if="this.tab === 'social'" class="col-span-2 border-l">
        <h2 class="border-b-2 text-2xl bold pl-4 font-bold">
          Social Links
        </h2>
        <p class="text-gray5 m-4">
          Link your social media accounts:
        </p>
        <VerifySocial platform="twitter" class="mx-4 my-2" />
        <VerifySocial platform="github" class="mx-4 my-2 pb-2" />
        <p class="text-gray5 p-4 border-t">
          Link your professional account:
        </p>
        <VerifySocial platform="website" class="mx-4 mb-4" />
      </article>
    </section>
    <div v-if="this.tab !== ''" class="text-right pt-4">
      <BrandedButton text="Save Changes" :action="this.updateSettings" :class="this.hasChanged() ? '' : 'opacity-50'" />
    </div>
  </main>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapMutations } from 'vuex'

import BrandedButton from '@/components/BrandedButton.vue'
import ChevronRight from '@/components/icons/ChevronRight.vue'
import UploadAvatar from '@/components/icons/UploadAvatar.vue'
import { MutationType, namespace as sessionStoreNamespace, SessionState } from '~/store/session'

export default Vue.extend({
	components: {
		VerifySocial: () => import(`@/components/VerifySocial.vue`),
		BrandedButton,
		ChevronRight,
		UploadAvatar,
	},
	layout: `Extended`,
	data () {
		return {
			newName: ``,
			profilePic: null,
			newID: ``,
			newEmail: ``,
			location: ``,
			bio: this.$store.state.session.bio,
			maxCharBio: 256,
			tab: ``,
		}
	},
	created () {
		if (this.$store.state.session.avatar !== ``) {
			this.$getPhoto(this.$store.state.session.avatar).then((image) => {
				this.profilePic = image
			})
		}
	},
	methods: {
		...mapMutations(sessionStoreNamespace, {
			changeCID: MutationType.CHANGE_CID,
			changeID: MutationType.CHANGE_ID,
			changeName: MutationType.CHANGE_NAME,
			changeEmail: MutationType.CHANGE_EMAIL,
			changeAvatar: MutationType.CHANGE_AVATAR,
			changeBio: MutationType.CHANGE_BIO,
			changeLocation: MutationType.CHANGE_LOCATION,
		}),
		isActiveTab (t) {
			if (t === this.tab) {
				return true
			} else {
				return false
			}
		},
		hasChanged () {
			if (
				this.newName !== `` ||
        this.newID !== `` ||
        this.newEmail !== `` ||
        this.location !== `` ||
        this.bio !== this.$store.state.session.bio
			) {
				return true
			}
			return false
		},
		changeTab (tab) {
			this.tab = tab
		},
		handleImage (e) {
			const image = e.target.files[0]
			const reader = new FileReader()
			reader.readAsDataURL(image)
			reader.onload = (i) => {
				if (i.target !== null) {
					this.uploadImage(i.target.result)
				}
			}
		},
		uploadImage (image) {
			this.$sendPhoto(image).then((cid) => {
				this.changeAvatar(cid)
				this.downloadImage(cid)
			})
			this.$sendProfile(this.$store.state.session).then((cid) => {
				this.changeCID(cid)
			})
		},
		downloadImage (cid) {
			this.$getPhoto(cid).then((image) => {
				this.profilePic = image
			})
		},
		checkBio () {
			const charCount = this.bio.length
			return this.maxCharBio - charCount
		},
		updateSettings () {
			if (this.hasChanged() === false) {
				alert(`Nothing to update!`)
				return
			}
			// Run quality rules before saving
			if (this.newName !== ``) {
				this.changeName(this.newName)
			}
			if (this.newID !== `` && this.$qualityID(this.newID)) {
				this.changeID(this.newID)
			}
			if (this.bio !== this.$store.state.session.bio && this.checkBio() > 0) {
				this.changeBio(this.bio)
			}
			if (this.newEmail !== `` && this.$qualityEmail(this.newEmail)) {
				this.changeEmail(this.newEmail)
			}
			if (this.location !== this.$store.state.session.location && this.$qualityText(this.location)) {
				this.changeLocation(this.location)
			}
			this.$sendProfile(this.$store.state.session).then((cid) => {
				this.changeCID(cid)
			})
			alert(`Settings updated!`)
			this.$router.push(`/` + this.$store.state.session.cid)
		},
	},
})
</script>
