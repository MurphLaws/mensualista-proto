"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input, Label, Textarea } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { api } from "@/lib/api";

const COVERS = ["/covers/yoga.svg", "/covers/pilates.svg", "/covers/funcional.svg", "/covers/pack.svg"];

export function NuevaListingForm() {
  const router = useRouter();
  const [type, setType] = useState<"CLASE" | "PACK">("CLASE");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [startsAt, setStartsAt] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    d.setHours(10, 0, 0, 0);
    return d.toISOString().slice(0, 16);
  });
  const [capacity, setCapacity] = useState(20);
  const [priceCents, setPriceCents] = useState(5000);
  const [packSize, setPackSize] = useState(5);
  const [coverUrl, setCoverUrl] = useState(COVERS[0]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await api("/api/listings", {
        method: "POST",
        body: JSON.stringify({
          type,
          title,
          description,
          location,
          startsAt: new Date(startsAt).toISOString(),
          capacity,
          priceCents,
          packSize: type === "PACK" ? packSize : undefined,
          coverUrl,
        }),
      });
      router.push("/empresa");
      router.refresh();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="card space-y-5 p-6">
      <div data-tour="empresa-new.type">
        <Label>Tipo</Label>
        <div className="flex gap-2">
          {(["CLASE", "PACK"] as const).map((t) => (
            <button
              type="button"
              key={t}
              onClick={() => setType(t)}
              className={`rounded-xl border px-4 py-2 text-sm font-medium ${
                type === t ? "border-brand-500 bg-brand-50 text-brand-700" : "border-ink-200 text-ink-700"
              }`}
            >
              {t === "CLASE" ? "Clase" : "Pack de clases"}
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="title">Titulo</Label>
        <Input id="title" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="p. ej. Yoga al amanecer" />
      </div>

      <div>
        <Label htmlFor="desc">Descripcion</Label>
        <Textarea id="desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Que se hace, para quien, que llevar." />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="loc">Ubicacion</Label>
          <Input id="loc" required value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Estudio Aurora — Sala 1" />
        </div>
        <div>
          <Label htmlFor="when">Fecha y hora</Label>
          <Input id="when" type="datetime-local" required value={startsAt} onChange={(e) => setStartsAt(e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <Label htmlFor="cap">Capacidad</Label>
          <Input id="cap" type="number" min={1} required value={capacity} onChange={(e) => setCapacity(Number(e.target.value))} />
        </div>
        <div data-tour="empresa-new.price">
          <Label htmlFor="price">Precio (centavos)</Label>
          <Input id="price" type="number" min={0} value={priceCents} onChange={(e) => setPriceCents(Number(e.target.value))} />
          <p className="mt-1 text-xs text-ink-400">5000 = $50. Pone 0 para listing gratis.</p>
        </div>
        {type === "PACK" && (
          <div data-tour="empresa-new.packsize">
            <Label htmlFor="ps">Tamano del pack</Label>
            <Input id="ps" type="number" min={1} value={packSize} onChange={(e) => setPackSize(Number(e.target.value))} />
          </div>
        )}
      </div>

      <div>
        <Label>Imagen de portada</Label>
        <Select value={coverUrl} onChange={(e) => setCoverUrl(e.target.value)}>
          {COVERS.map((c) => (
            <option key={c} value={c}>
              {c.replace("/covers/", "").replace(".svg", "")}
            </option>
          ))}
        </Select>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex items-center justify-end gap-2 border-t border-ink-100 pt-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Publicando..." : "Publicar"}
        </Button>
      </div>
    </form>
  );
}
