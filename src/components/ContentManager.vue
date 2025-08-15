<template>
  <div class="space-y-6">
    <!-- Header with actions -->
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">{{ t('content') }}</h2>
      <div class="flex space-x-3">
        <button
          v-if="approvedDrafts.length > 0"
          @click="showTransformModal = true"
          class="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
        >
          <ArrowRightCircle class="w-4 h-4 mr-2" />
          {{ t('transformDraft') }}
        </button>
        <button
          @click="showForm = true"
          class="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Plus class="w-4 h-4 mr-2" />
          {{ t('newContent') }}
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex space-x-4">
      <select
        v-model="filterStatus"
        class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
      >
        <option value="">{{ t('allStatuses') }}</option>
        <option v-for="status in CONTENT_STATUSES" :key="status" :value="status">
          {{ t(status) }}
        </option>
      </select>
      <select
        v-model="filterChannel"
        class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        :disabled="!channels || channels.length === 0"
      >
        <option value="">{{ t('allChannels') }}</option>
        <option v-if="!channels || channels.length === 0" disabled>
          {{ loadingChannels ? 'Carregando canais...' : 'Nenhum canal disponível' }}
        </option>
        <option v-for="channel in channels" :key="channel.id" :value="channel.id">
          {{ channel.name }}
        </option>
      </select>
    </div>

    <!-- Transform Draft Modal -->
    <Teleport to="body">
      <div v-if="showTransformModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[calc(100vh-2rem)] overflow-y-auto">
          <div class="p-6">
          <!-- Header -->
          <div class="flex items-center mb-4">
            <div class="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mr-3">
              <ArrowRight class="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                {{ t('transformDraftToContent', language) }}
              </h3>
            </div>
          </div>

          <!-- Content -->
          <div class="mb-6">
            <p class="text-gray-600 dark:text-gray-400 mb-4">
              {{ t('transformDraftDescription', language) }}
            </p>

            <!-- Selected Draft Info (if any) -->
            <div v-if="selectedDraft" class="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600 mb-4">
              <div class="flex items-center">
                <FileText class="w-4 h-4 text-gray-500 dark:text-gray-400 mr-2 flex-shrink-0" />
                <div class="min-w-0 flex-1">
                  <span class="text-sm font-medium text-gray-900 dark:text-white block truncate">
                    {{ selectedDraft.name }}
                  </span>
                  <span class="text-xs text-gray-500 dark:text-gray-400">
                    {{ getContentTypeLabel(selectedDraft.type) }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Form -->
            <form @submit.prevent="handleTransform" class="space-y-4">
              <!-- Draft Selection (full width) -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {{ t('selectDraft', language) }} *
                </label>
                <select
                  v-model="selectedDraft"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  required
                  :disabled="isTransforming"
                >
                  <option :value="null">{{ t('selectApprovedDraft', language) }}</option>
                  <option v-for="draft in approvedDrafts" :key="draft.id" :value="draft">
                    {{ draft.name }} - {{ getContentTypeLabel(draft.type) }}
                  </option>
                </select>
              </div>

              <!-- First Row: Product and Producer -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Product Selection -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {{ t('product', language) }}
                  </label>
                  <select
                    v-model="formData.product"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    :disabled="isTransforming"
                  >
                    <option value="">{{ t('selectProduct', language) }}</option>
                    <option v-for="product in products" :key="product.id" :value="product.id">
                      {{ product.name }}
                    </option>
                  </select>
                </div>

                <!-- Producer Selection -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {{ t('producer', language) }}
                  </label>
                  <select
                    v-model="formData.producer"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    :disabled="isTransforming"
                  >
                    <option value="">{{ t('selectProducer', language) }}</option>
                    <option v-for="userOption in users" :key="userOption.id" :value="userOption.id">
                      {{ userOption.name }}
                    </option>
                  </select>
                </div>
              </div>

              <!-- Second Row: Post Date and Status -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Post Date -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {{ t('postDate', language) }}
                  </label>
                  <input
                    type="datetime-local"
                    v-model="formData.postDate"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    :disabled="isTransforming"
                  />
                </div>

                <!-- Status Selection -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {{ t('status', language) }}
                  </label>
                  <select
                    v-model="formData.status"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    :disabled="isTransforming"
                  >
                    <option v-for="status in CONTENT_STATUSES" :key="status" :value="status">
                      {{ t(status, language) }}
                    </option>
                  </select>
                </div>
              </div>

              <!-- Third Row: Channels (full width) -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ t('channels', language) }} *
                </label>
                <div class="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-32 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-lg p-3">
                  <div v-for="channel in channels" :key="channel.id" class="flex items-center">
                    <input
                      :id="`transform-channel-${channel.id}`"
                      type="checkbox"
                      :value="channel.id"
                      v-model="formData.channels"
                      :disabled="isTransforming"
                      class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 disabled:opacity-50"
                    />
                    <label 
                      :for="`transform-channel-${channel.id}`"
                      class="ml-2 text-sm text-gray-900 dark:text-gray-300 cursor-pointer truncate"
                    >
                      {{ channel.name }}
                    </label>
                  </div>
                </div>
                <p v-if="formData.channels.length === 0" class="text-xs text-red-500 mt-1">
                  {{ t('selectAtLeastOneChannel', language) }}
                </p>
              </div>
            </form>
          </div>

          <!-- Actions -->
          <div class="flex flex-col sm:flex-row gap-3 sm:justify-end pt-4 border-t border-gray-200 dark:border-gray-600">
            <button
              type="button"
              @click="cancelTransform"
              :disabled="isTransforming"
              class="w-full sm:w-auto px-6 py-2 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-700 dark:bg-gray-600 dark:hover:bg-gray-500 dark:disabled:bg-gray-700 dark:text-gray-300 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ t('cancel', language) }}
            </button>
            <button
              @click="handleTransform"
              :disabled="isTransforming || !selectedDraft || formData.channels.length === 0"
              class="w-full sm:w-auto flex items-center justify-center px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg transition-colors space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Loader2 v-if="isTransforming" class="w-4 h-4 animate-spin" />
              <ArrowRight v-else class="w-4 h-4" />
              <span>{{ isTransforming ? t('transforming', language) : t('transformToContent', language) }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    </Teleport>

    <!-- Content Form -->
    <div v-if="showForm" class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {{ editingContent ? t('editContent') : t('createNewContent') }}
      </h3>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {{ t('name', language) }}
            </label>
            <input
              type="text"
              v-model="formData.name"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {{ t('type', language) }}
            </label>
            <select
              v-model="formData.type"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              required
            >
              <option value="">{{ t('type', language) }}</option>
              <option v-for="type in CONTENT_TYPES" :key="type" :value="type">
                {{ t(`contentTypes.${type}`, language) }}
              </option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {{ t('product', language) }}
            </label>
            <select
              v-model="formData.product"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              required
            >
              <option value="">{{ t('product', language) }}</option>
              <option v-for="product in products" :key="product.id" :value="product.id">
                {{ product.name }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {{ t('postDate', language) }}
            </label>
            <input
              type="datetime-local"
              v-model="formData.postDate"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {{ t('creator', language) }}
            </label>
            <select
              v-model="formData.creator"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              required
              :disabled="user.adminType !== 'ADMIN'"
            >
              <option v-for="userOption in users" :key="userOption.id" :value="userOption.id">
                {{ userOption.name }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {{ t('producer', language) }}
            </label>
            <select
              v-model="formData.producer"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              required
            >
              <option v-for="userOption in users" :key="userOption.id" :value="userOption.id">
                {{ userOption.name }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {{ t('status', language) }}
            </label>
            <select
              v-model="formData.status"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option v-for="status in CONTENT_STATUSES" :key="status" :value="status">
                {{ t(status, language) }}
              </option>
            </select>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ t('channels', language) }}
          </label>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
            <label v-for="channel in channels" :key="channel.id" class="flex items-center">
              <input
                type="checkbox"
                :value="channel.id"
                v-model="formData.channels"
                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">{{ channel.name }}</span>
            </label>
          </div>
        </div>

        <div class="flex space-x-3">
          <button
            type="submit"
            :disabled="isSubmitting"
            class="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors"
          >
            <Loader2 v-if="isSubmitting" class="w-4 h-4 mr-2 animate-spin" />
            <Plus v-else class="w-4 h-4 mr-2" />
            {{ isSubmitting ? (editingContent ? t('updating', language) : t('creating', language)) : (editingContent ? t('update', language) : t('create', language)) }}
          </button>
          <button
            type="button"
            @click="resetForm"
            :disabled="isSubmitting"
            class="px-4 py-2 bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 text-gray-700 rounded-lg transition-colors"
          >
            {{ t('cancel', language) }}
          </button>
        </div>
      </form>
    </div>

    <!-- Loading state -->
    <div v-if="loadingContent" class="space-y-6">
      <!-- Table skeleton -->
      <div class="overflow-x-auto">
        <table class="w-full border border-gray-200 dark:border-gray-700 rounded-lg">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-left">
                <SkeletonLoader customClass="h-4 w-16" />
              </th>
              <th class="px-6 py-3 text-left">
                <SkeletonLoader customClass="h-4 w-12" />
              </th>
              <th class="px-6 py-3 text-left">
                <SkeletonLoader customClass="h-4 w-20" />
              </th>
              <th class="px-6 py-3 text-left">
                <SkeletonLoader customClass="h-4 w-16" />
              </th>
              <th class="px-6 py-3 text-left">
                <SkeletonLoader customClass="h-4 w-20" />
              </th>
              <th class="px-6 py-3 text-left">
                <SkeletonLoader customClass="h-4 w-16" />
              </th>
              <th class="px-6 py-3 text-right">
                <SkeletonLoader customClass="h-4 w-16" />
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="i in 6" :key="i" class="animate-pulse">
              <td class="px-6 py-4">
                <SkeletonLoader customClass="h-4 w-32" />
              </td>
              <td class="px-6 py-4">
                <SkeletonLoader customClass="h-4 w-20" />
              </td>
              <td class="px-6 py-4">
                <SkeletonLoader customClass="h-4 w-24" />
              </td>
              <td class="px-6 py-4">
                <SkeletonLoader customClass="h-6 w-24 rounded-full" />
              </td>
              <td class="px-6 py-4">
                <SkeletonLoader customClass="h-4 w-28" />
              </td>
              <td class="px-6 py-4">
                <div class="flex flex-wrap gap-1">
                  <SkeletonLoader customClass="h-5 w-16 rounded-full" />
                  <SkeletonLoader customClass="h-5 w-20 rounded-full" />
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center justify-end space-x-2">
                  <SkeletonLoader customClass="h-8 w-8 rounded" />
                  <SkeletonLoader customClass="h-8 w-8 rounded" />
                  <SkeletonLoader customClass="h-8 w-8 rounded" />
                  <SkeletonLoader customClass="h-8 w-8 rounded" />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Content List -->
    <div v-else class="overflow-x-auto">
      <table class="w-full border border-gray-200 dark:border-gray-700 rounded-lg">
        <thead class="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              {{ t('name', language) }}
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              {{ t('type', language) }}
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              {{ t('product', language) }}
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              {{ t('status', language) }}
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              {{ t('postDate', language) }}
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              {{ t('channels', language) }}
            </th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              {{ t('actions', language) }}
            </th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          <tr v-for="item in filteredContent" :key="item.id">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900 dark:text-white">{{ item.name }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-500 dark:text-gray-400">{{ getContentTypeLabel(item.type) }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-500 dark:text-gray-400">
                {{ getProductName(item.productId) }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <select
                v-if="canUpdateStatus(item)"
                :value="item.status"
                @change="handleStatusChange(item, $event.target.value)"
                class="text-xs rounded-full px-2 py-1 border-0 focus:ring-2 focus:ring-blue-500"
                :class="getStatusClass(item.status)"
              >
                <option value="PENDING">{{ t('PENDING', language) }}</option>
                <option value="IN_PRODUCTION">{{ t('IN_PRODUCTION', language) }}</option>
                <option value="POSTED">{{ t('POSTED', language) }}</option>
                <option value="FINISHED">{{ t('FINISHED', language) }}</option>
                <option value="CANCELED">{{ t('CANCELED', language) }}</option>
              </select>
              <span
                v-else
                class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                :class="getStatusClass(item.status)"
              >
                {{ t(item.status, language) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-500 dark:text-gray-400">
                {{ formatDate(item.postDate) }}
              </div>
            </td>
            <td class="px-6 py-4">
              <div class="flex flex-wrap gap-1">
                <span v-for="channel in item.channels" :key="channel.id" 
                      class="inline-flex px-2 py-1 text-xs bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded">
                  {{ channel.name }}
                </span>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div class="flex items-center justify-end space-x-2">
                <button
                  v-if="['POSTED', 'FINISHED'].includes(item.status)"
                  @click="openMetricsModal(item)"
                  class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                  :title="t('updateMetrics', language)"
                >
                  <BarChart3 class="w-4 h-4" />
                </button>
                <button
                  v-if="canEdit(item)"
                  @click="handleEdit(item)"
                  class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  <Edit class="w-4 h-4" />
                </button>
                <button
                  v-if="canEdit(item)"
                  @click="handleDelete(item)"
                  class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty state -->
    <div v-if="!loadingContent && filteredContent.length === 0" class="text-center py-12">
      <Box class="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
        {{ t('noContentFound', language) }}
      </h3>
      <p class="text-gray-600 dark:text-gray-400 mb-4">
        {{ t('createFirstContent', language) }}
      </p>
      <button
        @click="showForm = true"
        class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
      >
        <Plus class="w-4 h-4 mr-2" />
        {{ t('newContent', language) }}
      </button>
    </div>

    <!-- Metrics Modal -->
    <Teleport to="body">
      <div v-if="showMetricsModal && selectedContentForMetrics" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[calc(100vh-2rem)] overflow-y-auto">
          <div class="p-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {{ t('updateMetrics', language) }} - {{ selectedContentForMetrics.name }}
            </h3>
          
          <div class="space-y-6">
            <div v-for="channel in selectedContentForMetrics.channels" :key="channel.id" class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h4 class="text-md font-medium text-gray-900 dark:text-white mb-4">
                {{ channel.name }} {{ t('metrics', language) }}
              </h4>
              
              <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {{ t('likes', language) }}
                  </label>
                  <input
                    type="number"
                    min="0"
                    :value="channelMetrics[channel.id]?.likes || 0"
                    @input="updateChannelMetric(channel.id, 'likes', parseInt($event.target.value) || 0)"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {{ t('comments', language) }}
                  </label>
                  <input
                    type="number"
                    min="0"
                    :value="channelMetrics[channel.id]?.comments || 0"
                    @input="updateChannelMetric(channel.id, 'comments', parseInt($event.target.value) || 0)"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {{ t('shares', language) }}
                  </label>
                  <input
                    type="number"
                    min="0"
                    :value="channelMetrics[channel.id]?.shares || 0"
                    @input="updateChannelMetric(channel.id, 'shares', parseInt($event.target.value) || 0)"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {{ t('siteVisits', language) }}
                  </label>
                  <input
                    type="number"
                    min="0"
                    :value="channelMetrics[channel.id]?.siteVisits || 0"
                    @input="updateChannelMetric(channel.id, 'siteVisits', parseInt($event.target.value) || 0)"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {{ t('newAccounts', language) }}
                  </label>
                  <input
                    type="number"
                    min="0"
                    :value="channelMetrics[channel.id]?.newAccounts || 0"
                    @input="updateChannelMetric(channel.id, 'newAccounts', parseInt($event.target.value) || 0)"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {{ t('postClicks', language) }}
                  </label>
                  <input
                    type="number"
                    min="0"
                    :value="channelMetrics[channel.id]?.postClicks || 0"
                    @input="updateChannelMetric(channel.id, 'postClicks', parseInt($event.target.value) || 0)"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="flex space-x-3 mt-6">
            <button
              @click="handleSaveChannelMetrics"
              :disabled="savingMetrics"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center space-x-2"
            >
              <Loader2 v-if="savingMetrics" class="h-4 w-4 animate-spin" />
              <span>{{ savingMetrics ? t('saving', language) : t('save', language) }}</span>
            </button>
            <button
              @click="closeMetricsModal"
              :disabled="savingMetrics"
              class="px-4 py-2 bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 disabled:cursor-not-allowed text-gray-700 rounded-lg transition-colors"
            >
              {{ t('cancel', language) }}
            </button>
          </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template><script setup>
import { ref, computed, onMounted, reactive, watch } from 'vue'
import { Plus, Edit, Trash2, ArrowRightCircle, Box, BarChart3, Loader2, FileText, ArrowRight } from 'lucide-vue-next'
import { useLanguage } from '../hooks/useLanguage.js'
import { useAuth } from '../hooks/useAuth.js'
import { useData } from '../hooks/useData.js'
import { t as translate } from '../translations/index.js'
import { CONTENT_TYPES, CONTENT_STATUSES } from '../constants/index.js'
import SkeletonLoader from './SkeletonLoader.vue'

const { language } = useLanguage()
const { currentUser: user } = useAuth()
const { 
  content,
  products,
  users,
  drafts,
  channels,
  loadingChannels,
  loadingContent,
  fetchContent,
  fetchProducts,
  fetchUsers,
  fetchDrafts,
  fetchChannels,
  createContent,
  updateContent,
  updateContentStatus,
  updateContentChannelMetrics,
  deleteContent,
  transformDraftToContent
} = useData()

const t = (key) => translate(key, language.value)

// State
const showForm = ref(false)
const showTransformModal = ref(false)
const showMetricsModal = ref(false)
const editingContent = ref(null)
const selectedDraft = ref(null)
const selectedContentForMetrics = ref(null)
const filterStatus = ref('')
const filterChannel = ref('')
const isSubmitting = ref(false)
const isTransforming = ref(false)
const savingMetrics = ref(false)
const channelMetrics = ref({})

const formData = reactive({
  name: '',
  type: '',
  product: '',
  creator: user.value?.id || '',
  postDate: '',
  producer: user.value?.id || '',
  status: 'PENDING',
  channels: []
})

// Load data on component mount
onMounted(async () => {
  await Promise.all([
    fetchContent(), // Carrega sem filtros inicialmente
    fetchProducts(),
    fetchUsers(),
    fetchDrafts(),
    fetchChannels()
  ])
})

// Computed values
const approvedDrafts = computed(() => {
  if (!drafts.value || !user.value) return []
  
  return user.value.adminType === 'ADMIN'
    ? drafts.value.filter(d => d.status === 'APPROVED')
    : drafts.value.filter(d => d.status === 'APPROVED' && d.creatorId === user.value.id)
})

const filteredContent = computed(() => {
  // Com a nova API, a filtragem é feita no backend
  // Aqui só aplicamos filtros de permissão baseados no usuário
  if (!content.value || !user.value) return []
  
  return user.value.adminType === 'ADMIN'
    ? content.value
    : content.value.filter(c => c.creatorId === user.value.id || c.producerId === user.value.id)
})

// Watchers para recarregar conteúdo quando filtros mudarem
watch([filterStatus, filterChannel], async () => {
  await loadContentWithFilters()
}, { immediate: false })

// Método para carregar conteúdo com filtros
const loadContentWithFilters = async () => {
  const filters = {}
  if (filterStatus.value) filters.status = filterStatus.value
  if (filterChannel.value) filters.channelId = filterChannel.value
  
  await fetchContent(filters)
}

// Permission functions
const canEdit = (item) => {
  return user.value?.adminType === 'ADMIN' || item.creatorId === user.value?.id || item.producerId === user.value?.id
}

const canUpdateStatus = (item) => {
  return user.value?.adminType === 'ADMIN' || item.producerId === user.value?.id
}

// Methods
const handleSubmit = async () => {
  isSubmitting.value = true
  try {
    const contentData = {
      name: formData.name,
      type: formData.type,
      productId: formData.product, // Map to API field
      postDate: formatDateForBackend(formData.postDate), // Formato compatível com backend
      channelIds: formData.channels, // API expects channelIds
      status: formData.status // Send status for both create and update
    }
    
    // Add optional producerId for both create and update
    if (formData.producer) {
      contentData.producerId = formData.producer
    }
    
    // Add optional fields for updates only
    if (editingContent.value) {
      contentData.creatorId = formData.creator
    }
    
    if (editingContent.value) {
      await updateContent(editingContent.value.id, contentData)
    } else {
      await createContent(contentData)
    }
    
    resetForm()
    await fetchContent() // Refresh content list
  } catch (error) {
    console.error('Error saving content:', error)
  } finally {
    isSubmitting.value = false
  }
}

const handleTransform = async () => {
  if (!selectedDraft.value) return
  
  isTransforming.value = true
  try {
    const transformData = {
      status: formData.status,
      channelIds: formData.channels, // Required field
      postDate: formatDateForBackend(formData.postDate), // Formato compatível com backend
      productId: formData.product || undefined, // Optional 
      producerId: formData.producer || undefined // Optional
    }
    
    await transformDraftToContent(selectedDraft.value.id, transformData)
    cancelTransform()
    await fetchContent() // Refresh content list
  } catch (error) {
    console.error('Error transforming draft:', error)
  } finally {
    isTransforming.value = false
  }
}

const resetForm = () => {
  Object.assign(formData, {
    name: '',
    type: '',
    product: '',
    creator: user.value?.id || '',
    postDate: '',
    producer: user.value?.id || '',
    status: 'PENDING',
    channels: []
  })
  showForm.value = false
  editingContent.value = null
}

const cancelTransform = () => {
  showTransformModal.value = false
  selectedDraft.value = null
  resetForm()
}

const handleEdit = (item) => {
  editingContent.value = item
  Object.assign(formData, {
    name: item.name,
    type: item.type,
    product: item.productId,
    creator: item.creatorId,
    postDate: formatDateForInput(item.postDate),
    producer: item.producerId,
    status: item.status,
    channels: item.channels?.map(ch => ch.id) || []
  })
  showForm.value = true
}

const handleDelete = async (item) => {
  if (confirm(t('confirmDelete'))) {
    try {
      await deleteContent(item.id)
      await fetchContent() // Refresh content list
    } catch (error) {
      console.error('Error deleting content:', error)
    }
  }
}

const openMetricsModal = (item) => {
  selectedContentForMetrics.value = item
  
  // Initialize metrics for each channel using channelId
  const initialMetrics = {}
  item.channels.forEach(channel => {
    // Find existing metrics for this channel from the channelMetrics array
    const existingChannelMetric = item.metrics?.channelMetrics?.find(
      metric => metric.channelId === channel.id
    )
    
    initialMetrics[channel.id] = existingChannelMetric || {
      likes: 0,
      comments: 0,
      shares: 0,
      postClicks: 0,
      siteVisits: 0,
      newAccounts: 0
    }
  })
  
  channelMetrics.value = initialMetrics
  showMetricsModal.value = true
}

const updateChannelMetric = (channelId, metric, value) => {
  if (!channelMetrics.value[channelId]) {
    channelMetrics.value[channelId] = {}
  }
  channelMetrics.value[channelId][metric] = value
}

const handleSaveChannelMetrics = async () => {
  if (!selectedContentForMetrics.value) return
  
  savingMetrics.value = true
  
  try {
    // Validate that we have metrics to save
    if (Object.keys(channelMetrics.value).length === 0) {
      savingMetrics.value = false
      return
    }
    
    // Convert channelMetrics object to array format expected by API
    const channelMetricsArray = Object.entries(channelMetrics.value).map(([channelId, metrics]) => ({
      channelId: channelId.toString(), // API expects channelId as string (UUID)
      likes: metrics.likes || 0,
      comments: metrics.comments || 0,
      shares: metrics.shares || 0,
      siteVisits: metrics.siteVisits || 0,
      newAccounts: metrics.newAccounts || 0,
      postClicks: metrics.postClicks || 0
    }))
    
    const result = await updateContentChannelMetrics(selectedContentForMetrics.value.id, channelMetricsArray)
    
    if (result.success) {
      showMetricsModal.value = false
      selectedContentForMetrics.value = null
      channelMetrics.value = {}
      await fetchContent() // Refresh content
    } else {
      alert(`Erro ao atualizar métricas: ${result.error}`)
    }
  } catch (error) {
    console.error('Error updating metrics:', error)
    const errorMessage = error.response?.data?.message || error.message || 'Erro ao atualizar métricas'
    alert(`Erro ao atualizar métricas: ${errorMessage}`)
  } finally {
    savingMetrics.value = false
  }
}

const handleStatusChange = async (item, newStatus) => {
  try {
    const result = await updateContentStatus(item.id, newStatus)
    if (!result.success) {
      console.error('Error updating status:', result.error)
      // Optionally show user-friendly error message
      alert(`Erro ao atualizar status: ${result.error}`)
    }
    // No need to refresh content as the useData hook already updates the local state
  } catch (error) {
    console.error('Error updating status:', error)
    alert('Erro ao atualizar status do conteúdo')
  }
}

const closeMetricsModal = () => {
  showMetricsModal.value = false
  selectedContentForMetrics.value = null
}

// Control body overflow when modal is open
watch(showTransformModal, (newValue) => {
  if (newValue) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

watch(showMetricsModal, (newValue) => {
  if (newValue) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

// Helper functions
const getProductName = (productId) => {
  const product = products.value?.find(p => p.id === productId)
  return product?.name || ''
}

const getContentTypeLabel = (type) => {
  if (!type) return 'N/A'
  const key = `contentTypes.${type.toLowerCase()}`
  const translated = t(key, language.value)
  return translated !== key ? translated : type
}

const getStatusClass = (status) => {
  const classes = {
    'PENDING': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    'IN_PRODUCTION': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'POSTED': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'FINISHED': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    'CANCELED': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  }
  return classes[status] || classes['PENDING']
}

const formatDate = (dateValue) => {
  if (!dateValue) return ''
  
  let dateObj
  if (Array.isArray(dateValue)) {
    // Java LocalDateTime array format: [year, month, day, hour, min, sec, nanosec]
    const [year, month, day, hour = 0, minute = 0] = dateValue
    dateObj = new Date(year, month - 1, day, hour, minute) // month is 0-indexed in JS
  } else {
    dateObj = new Date(dateValue)
  }
  
  // Formatar data e hora
  const locale = language.value === 'pt' ? 'pt-PT' : 'en-US'
  const dateStr = dateObj.toLocaleDateString(locale)
  const timeStr = dateObj.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })
  
  return `${dateStr} ${timeStr}`
}

const formatDateForInput = (dateValue) => {
  if (!dateValue) return ''
  
  let dateObj
  if (Array.isArray(dateValue)) {
    const [year, month, day, hour = 0, minute = 0] = dateValue
    dateObj = new Date(year, month - 1, day, hour, minute)
  } else {
    dateObj = new Date(dateValue)
  }
  
  // Formato para datetime-local: YYYY-MM-DDTHH:MM
  const year = dateObj.getFullYear()
  const month = String(dateObj.getMonth() + 1).padStart(2, '0')
  const day = String(dateObj.getDate()).padStart(2, '0')
  const hours = String(dateObj.getHours()).padStart(2, '0')
  const minutes = String(dateObj.getMinutes()).padStart(2, '0')
  
  return `${year}-${month}-${day}T${hours}:${minutes}`
}

// Função para formatar data para o backend (formato: yyyy-MM-dd'T'HH:mm:ss)
const formatDateForBackend = (dateValue) => {
  if (!dateValue) return undefined
  
  const dateObj = new Date(dateValue)
  
  // Formato exato esperado pelo backend: yyyy-MM-dd'T'HH:mm:ss
  const year = dateObj.getFullYear()
  const month = String(dateObj.getMonth() + 1).padStart(2, '0')
  const day = String(dateObj.getDate()).padStart(2, '0')
  const hours = String(dateObj.getHours()).padStart(2, '0')
  const minutes = String(dateObj.getMinutes()).padStart(2, '0')
  const seconds = String(dateObj.getSeconds()).padStart(2, '0')
  
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`
}
</script>
