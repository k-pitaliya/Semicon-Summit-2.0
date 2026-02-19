import { Image, ImagePlus, Trash2 } from 'lucide-react'

const GalleryTab = ({
    galleryImages,
    loading,
    actionLoading,
    setGalleryUploadModal,
    handleDeleteGalleryImage
}) => (
    <section className="dashboard-section">
        <div className="section-header">
            <h2><Image size={20} /> Gallery Management</h2>
            <button
                className="btn btn-primary"
                onClick={() => setGalleryUploadModal(true)}
            >
                <ImagePlus size={18} />
                Upload Images
            </button>
        </div>

        <div className="gallery-grid">
            {loading ? (
                <div className="loading-state">Loading gallery...</div>
            ) : galleryImages.length === 0 ? (
                <div className="empty-state">
                    <Image size={48} />
                    <p>No images in gallery yet</p>
                    <button
                        className="btn btn-primary"
                        onClick={() => setGalleryUploadModal(true)}
                    >
                        Upload First Image
                    </button>
                </div>
            ) : (
                galleryImages.map(img => (
                    <div key={img._id} className="gallery-card">
                        <div className="gallery-image">
                            <img src={img.thumbnailUrl || img.url} alt={img.title} />
                        </div>
                        <div className="gallery-info">
                            <h4>{img.title}</h4>
                            <span className="badge badge-info">{img.category}</span>
                        </div>
                        <div className="gallery-actions">
                            <button
                                className="btn-icon btn-danger"
                                onClick={() => handleDeleteGalleryImage(img._id)}
                                disabled={actionLoading === img._id}
                                title="Delete Image"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    </section>
)

export default GalleryTab
